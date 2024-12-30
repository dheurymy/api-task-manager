const express = require('express'); // Importa o módulo express para criar o servidor
const mongoose = require('mongoose'); // Importa o módulo mongoose para interagir com o MongoDB
const cors = require('cors'); // Importa o módulo cors para permitir requisições de diferentes origens
const dotenv = require('dotenv'); // Importa o módulo dotenv para gerenciar variáveis de ambiente
const jwt = require('jsonwebtoken'); // Importa o módulo jsonwebtoken para verificação de tokens
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para hash de senhas
const User = require('./models/User'); // Importa o modelo de usuário
const Task = require('./models/Task'); // Importa o modelo de tarefa

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express(); // Cria uma instância do aplicativo Express
const PORT = process.env.PORT || 5000; // Define a porta do servidor a partir da variável de ambiente ou usa 5000 como padrão
const MONGO_URI = process.env.MONGO_URI; // Obtém a URI de conexão do MongoDB a partir da variável de ambiente

app.use(cors()); // Utiliza o middleware CORS
app.use(express.json()); // Utiliza o middleware para parsear o corpo das requisições como JSON

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true, // Configuração para usar o novo parser de URL do MongoDB
  useUnifiedTopology: true, // Configuração para usar a nova engine de topo do MongoDB
})
.then(() => console.log('Connected to MongoDB')) // Mensagem de sucesso na conexão com o MongoDB
.catch(err => console.error('Error connecting to MongoDB:', err.message)); // Mensagem de erro na conexão com o MongoDB


const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', ''); // Obtém o token do cabeçalho de autorização e remove o prefixo 'Bearer '
  if (!token) return res.status(401).json({ message: 'Autorização negada' }); // Verifica se o token está presente, caso contrário, retorna erro 401

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token usando a chave secreta
    req.user = decoded; // Define o usuário decodificado no objeto de requisição
    next(); // Passa para o próximo middleware ou rota
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' }); // Retorna erro 401 se o token for inválido
  }
};



app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})


// Registro de usuário
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body; // Extrai nome, email e senha do corpo da requisição

  try {
    const user = new User({ name, email, password }); // Cria um novo usuário com os dados fornecidos
    await user.save(); // Salva o usuário no banco de dados
    res.status(201).json({ message: 'Usuário registrado com sucesso' }); // Retorna mensagem de sucesso com status 201
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Login de usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extrai email e senha do corpo da requisição

  try {
    const user = await User.findOne({ email }); // Busca o usuário pelo email no banco de dados
    if (!user || !(await user.comparePassword(password))) { // Verifica se o usuário existe e se a senha é válida
      return res.status(401).json({ message: 'Credenciais inválidas' }); // Retorna mensagem de credenciais inválidas com status 401
    }

    const token = jwt.sign({ userId: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { // Gera um token JWT com o ID do usuário
      expiresIn: '1h', // Define a expiração do token para 1 hora
    });

    res.json({ token }); // Retorna o token JWT
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Logout de usuário (opcional, pode ser manejado pelo frontend)
app.post('/logout', (req, res) => {
  res.json({ message: 'Logout bem-sucedido' }); // Retorna mensagem de logout bem-sucedido
});

// Obter todas as tarefas do usuário autenticado
app.get('/tasks', authMiddleware, async (req, res) => { 
  try {
    const tasks = await Task.find({ userId: req.user.userId }); // Busca todas as tarefas do usuário autenticado
    res.json(tasks); // Retorna as tarefas em formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna mensagem de erro com status 500
  }
});

// Criar nova tarefa
app.post('/addtask', authMiddleware, async (req, res) => {
  const { text, category } = req.body; // Extrai texto e categoria do corpo da requisição

  try {
    const task = new Task({ userId: req.user.userId, text, category }); // Cria uma nova tarefa com os dados fornecidos
    const newTask = await task.save(); // Salva a nova tarefa no banco de dados
    res.status(201).json(newTask); // Retorna a nova tarefa criada com status 201
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Atualizar uma tarefa
app.patch('/:id', authMiddleware, async (req, res) => {
  const updates = Object.keys(req.body); // Extrai as chaves das propriedades a serem atualizadas do corpo da requisição
  const allowedUpdates = ['text', 'category', 'isCompleted']; // Define quais atualizações são permitidas
  const isValidOperation = updates.every(update => allowedUpdates.includes(update)); // Verifica se todas as atualizações são permitidas

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Atualizações inválidas' }); // Retorna mensagem de erro se houver atualizações inválidas
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.userId }); // Busca a tarefa pelo ID e pelo usuário autenticado
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' }); // Retorna mensagem de erro se a tarefa não for encontrada
    }

    updates.forEach(update => task[update] = req.body[update]); // Atualiza as propriedades da tarefa com os novos valores
    await task.save(); // Salva as atualizações no banco de dados
    res.json(task); // Retorna a tarefa atualizada
  } catch (err) {
    res.status(400).json({ message: err.message }); // Retorna mensagem de erro com status 400
  }
});

// Deletar uma tarefa
app.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // Deleta a tarefa pelo ID e pelo usuário autenticado
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' }); // Retorna mensagem de erro se a tarefa não for encontrada
    }

    res.json({ message: 'Tarefa deletada' }); // Retorna mensagem de sucesso
  } catch (err) {
    res.status(500).json({ message: err.message }); // Retorna mensagem de erro com status 500
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Mensagem indicando que o servidor está rodando na porta especificada
});

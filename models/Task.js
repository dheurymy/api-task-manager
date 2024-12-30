const mongoose = require('mongoose'); // Importa o módulo mongoose

const TaskSchema = new mongoose.Schema({ // Cria um novo esquema de tarefa
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Define o tipo como ObjectId
    ref: 'User', // Referência ao modelo de usuário
    required: true, // Campo obrigatório
  },
  text: {
    type: String, // Define o tipo como String
    required: true, // Campo obrigatório
  },
  category: {
    type: String, // Define o tipo como String
    required: true, // Campo obrigatório
  },
  isCompleted: {
    type: Boolean, // Define o tipo como Boolean
    default: false, // Define o valor padrão como falso
  }
});

module.exports = mongoose.model('Task', TaskSchema); // Exporta o modelo Task baseado no esquema

const mongoose = require('mongoose'); // Importa o módulo mongoose
const bcrypt = require('bcryptjs'); // Importa o módulo bcryptjs para hash de senhas

const UserSchema = new mongoose.Schema({ // Cria um novo esquema de usuário
  name: {
    type: String, // Define o tipo como String
    required: true, // Campo obrigatório
  },
  email: {
    type: String, // Define o tipo como String
    required: true, // Campo obrigatório
    unique: true, // Define o campo como único
  },
  password: {
    type: String, // Define o tipo como String
    required: true, // Campo obrigatório
  }
});

// Função para hash da senha antes de salvar
UserSchema.pre('save', async function(next) { 
  const user = this;
  if (user.isModified('password')) { // Verifica se a senha foi modificada
    user.password = await bcrypt.hash(user.password, 8); // Hash da senha com custo de 8
  }
  next(); // Continua para a próxima middleware
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password); // Compara a senha candidata com a senha armazenada
};

module.exports = mongoose.model('User', UserSchema); // Exporta o modelo User baseado no esquema

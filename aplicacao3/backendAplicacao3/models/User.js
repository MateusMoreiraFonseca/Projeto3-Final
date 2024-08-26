const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  senha: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('senha')) return next();

  bcrypt.hash(user.senha, saltRounds, function (err, hash) {
    if (err) return next(err);
    user.senha = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.senha, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};


const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
  id: String,
  firstname: String,
  lastname: String,
  email: String,
  phone: String,
  birthday: String,
  gender: String,
  address: {
    street: String,
    streetName: String,
    city: String,
    country: String,
  },
  Foto: String,
});

const FakeData = mongoose.model('FakeData', DataSchema);

module.exports = FakeData;

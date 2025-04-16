const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    name: String,
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Banks', BankAccountSchema);
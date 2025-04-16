const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bank_name: String,
    bank_ac_number: String,
    bank_nick_name: String,
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('BankAccount', BankAccountSchema);
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    transaction_date: Date,
    vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UPIVendor' },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    transaction_type: {type: String, enum: ["Debit", "Credit"], default: "Debit"},
    transaction_amount: Number,
    transaction_description: String,
    bank_account: { type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' },
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Transactions', TransactionSchema);
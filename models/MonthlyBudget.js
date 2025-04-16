const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    budget_month: Number,
    budget_year: Number,
    amount: Number,
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('MonthlyBudget', BudgetSchema);
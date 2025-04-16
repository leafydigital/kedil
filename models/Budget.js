const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    budget_month: Number,
    budget_year: Number,
    assigned_amount: Number,
    activity_amount: Number,
    available_amount: Number,
    budget_group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    budget_category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    created_at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Budget', BudgetSchema);
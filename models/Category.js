const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Category', CategorySchema);
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group_name: String,
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('Group', GroupSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone_number: String,
    role: {type: String, enum: ["admin", "user"], default: "user"},
    address: String,
    created_at: { type: Date, default: Date.now },
    verified_at: Date,
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('User', UserSchema);
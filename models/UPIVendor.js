const mongoose = require('mongoose');

const UPIVendorSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    upi_id: String,
    vendor_name: String,
    vendor_category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    created_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true }
});
module.exports = mongoose.model('UPIVendor', UPIVendorSchema);

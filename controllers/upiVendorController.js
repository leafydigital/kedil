const UPIVendor = require('../models/UPIVendor');

// Create UPI Vendor
exports.createUPIVendor = async (req, res) => {
    try {
        const existingVendor = await UPIVendor.findOne({ vendor_name: req.body.vendor_name, user_id: req.user.user_id });
        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor already exists for this user' });
        }

        const existingUPI = await UPIVendor.findOne({ upi_id: req.body.upi_id, user_id: req.user.user_id });
        if (existingUPI) {
            return res.status(400).json({ message: 'UPI already exists for this user' });
        }

        const vendor = new UPIVendor(req.body);
        await vendor.save();
        res.status(201).json(vendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all UPI Vendors
exports.getUPIVendors = async (req, res) => {
    try {
        const vendors = await UPIVendor.find({ user_id: req.user.user_id }).populate('vendor_category').populate('user_id');


        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get UPI Vendor by ID
exports.getUPIVendorById = async (req, res) => {
    try {
        const vendor = await UPIVendor.findById(req.params.id).populate('vendor_category').populate('user_id');
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update UPI Vendor
exports.updateUPIVendor = async (req, res) => {
    try {
        const vendor = await UPIVendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete UPI Vendor
exports.deleteUPIVendor = async (req, res) => {
    try {
        const vendor = await UPIVendor.findByIdAndDelete(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
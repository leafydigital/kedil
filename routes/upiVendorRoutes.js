const express = require('express');
const {
    createUPIVendor,
    getUPIVendors,
    getUPIVendorById,
    updateUPIVendor,
    deleteUPIVendor
} = require('../controllers/upiVendorController');

const router = express.Router();

// UPI Vendor Routes
router.post('/create', createUPIVendor);
router.get('/select', getUPIVendors);
router.get('/select/:id', getUPIVendorById);
router.put('/update/:id', updateUPIVendor);
router.delete('/delete/:id', deleteUPIVendor);

module.exports = router;
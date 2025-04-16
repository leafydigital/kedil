const express = require('express');
const {
    createBankAccount,
    getBankAccounts,
    getBankAccountById,
    updateBankAccount,
    deleteBankAccount
} = require('../controllers/bankAccountController');

const { getAllBanks } = require('../controllers/bankController');

const router = express.Router();

// UPI Vendor Routes
router.post('/create', createBankAccount);
router.get('/select', getBankAccounts);
router.get('/select/:id', getBankAccountById);
router.put('/update/:id', updateBankAccount);
router.delete('/delete/:id', deleteBankAccount);

router.get('/select', getAllBanks);

module.exports = router;
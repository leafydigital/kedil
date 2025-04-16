const express = require('express');
const {
    createBudget,
    createMonthlyBudgets,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget
} = require('../controllers/budgetController');

const router = express.Router();

// UPI Vendor Routes
router.post('/create', createBudget);
router.post('/createmonthly', createMonthlyBudgets);
router.post('/select', getBudgets);
router.post('/select/:id', getBudgetById);
router.put('/update/:id', updateBudget);
router.delete('/delete/:id', deleteBudget);


module.exports = router;
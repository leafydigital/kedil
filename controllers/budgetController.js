const Budget = require('../models/Budget');

const Category = require('../models/Category');

// Create Budget
exports.createBudget = async (req, res) => {
    try {

        const userId = req.user.user_id;

        const existingBudget = await Budget.findOne({
            budget_month: req.body.budget_month,
            budget_year: req.body.budget_year,
            budget_category_id: req.body.budget_category_id,
            user_id: userId
        });

        if (existingBudget) {

            const { assigned_amount, budget_category_id, budget_month, budget_year, budget_group_id } = req.body;

            existingBudget.assigned_amount = assigned_amount;

            existingBudget.available_amount = existingBudget.assigned_amount + existingBudget.activity_amount;

            await existingBudget.save();

            return res.status(201).json(existingBudget);
        }
        else {
            const budgets = new Budget({
                ...req.body,
                activity_amount: 0,
                available_amount: 0,
                user_id: userId
            });

            await budgets.save();

            res.status(201).json(budgets);
        }


    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Create Monthly Budgets
exports.createMonthlyBudgets = async (req, res) => {
    try {

        const userId = req.user.user_id;
        const createdBudgets = [];

        const categories = await getCategories(userId); // assuming this returns a promise

        console.log("Categories", categories);

        for (const element of categories) {

            const existingBudget = await Budget.findOne({
                budget_month: req.body.budget_month,
                budget_year: req.body.budget_year,
                budget_category_id: element._id,
                user_id: userId
            });

            if (!existingBudget) {
                const budget = new Budget({
                    budget_category_id: element._id,
                    budget_group_id: element.group_id._id,
                    assigned_amount: 0,
                    activity_amount: 0,
                    available_amount: 0,
                    budget_month: req.body.budget_month,
                    budget_year: req.body.budget_year,
                    user_id: userId
                });

                const savedBudget = await budget.save();
                createdBudgets.push(savedBudget);
            }
        }

        res.status(201).json({
            message: 'Budgets created successfully',
            createdBudgets
        });

    } catch (err) {
        console.error('Error creating monthly budgets:', err);
        res.status(400).json({ error: err.message });
    }
};

// Get all Budgets
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user_id: req.user.user_id, budget_month: req.body.budget_month, budget_year: req.body.budget_year })
            .populate('user_id')
            .populate('budget_group_id')
            .populate('budget_category_id');
        res.status(200).json(budgets);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Budget by ID
exports.getBudgetById = async (req, res) => {
    try {
        const budgets = await Budget.findById(req.params.id).populate('user_id');
        if (!budgets) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Budget
exports.updateBudget = async (req, res) => {
    try {
        const budgets = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!budgets) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json(budgets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
    try {
        const budgets = await Budget.findByIdAndDelete(req.params.id);
        if (!budgets) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json({ message: 'Budget deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.getCategories = async (req, res) => {
//     try {
//         const categories = await Category.find({ user_id: req.user.user_id }).populate('group_id');
//         res.status(200).json(categories);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

const getCategories = async (userId) => {
    return await Category.find({ user_id: userId }).populate('group_id');
};
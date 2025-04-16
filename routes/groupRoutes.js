const express = require('express');
const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup
} = require('../controllers/groupCategoryController');

const router = express.Router();

// Category Routes
router.post('/createcategory', createCategory);
router.get('/getcategories', getCategories);
router.get('/getcategories/:id', getCategoryById);
router.put('/updatecategories/:id', updateCategory);
router.delete('/deletecategories/:id', deleteCategory);

// Group Routes
router.post('/creategroup', createGroup);
router.get('/getgroups', getGroups);
router.get('/getgroups/:id', getGroupById);
router.put('/updategroups/:id', updateGroup);
router.delete('/deletegroups/:id', deleteGroup);

module.exports = router;
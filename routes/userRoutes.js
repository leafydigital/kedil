const express = require('express');
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();
router.post('/create', createUser);
router.get('/select', getUsers);
router.get('/select:id', getUserById);
router.put('/update:id', updateUser);
router.delete('/delete:id', deleteUser);
module.exports = router;
// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, getUserById, getUsers, deletedUsers } = require('../controllers/userController');
 
router.post('/', createUser);
 
router.get('/', getUserById);
router.delete('/delete', deletedUsers);

module.exports = router;

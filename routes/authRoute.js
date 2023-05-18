

const express = require('express');
const { createUser, loginUserCtrl, getallUser, getsingleUser, deleteaUser, updateauser, blockUser, unblockUser, handleRefreshToken, logout } = require('../controller/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router =express.Router();


router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/all-users',getallUser);
router.get('/refresh',handleRefreshToken);
router.get('/logout',logout);
router.get('/:id',authMiddleware,isAdmin, getsingleUser);
router.delete('/:id',deleteaUser);
router.put('/edit-user',authMiddleware,updateauser);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);

module.exports =router;
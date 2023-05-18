

const express = require('express');
const { createUser, loginUserCtrl, getallUser, getsingleUser, deleteaUser, updateauser } = require('../controller/userController');
const router =express.Router();


router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.get('/all-users',getallUser);
router.get('/:id',getsingleUser);
router.delete('/:id',deleteaUser);
router.put('/:id',updateauser);



module.exports =router;
const express = require('express')
const router = express.Router()
const Users = require('../controllers/adminController')
// const { route } = require('../../app')
//controlers


router.get("/" , Users.getAllUsers)
router.get("/:id" , Users.getSingleUsers)
router.post("/create" , Users.postSingleUsers)
router.put("/update" , Users.getUpdateUsers)
router.delete("/:id" , Users.deleteUser)
router.post("/multiple-delete" , Users.deleteMultipleUsers)
router.post("/login" , Users.loginuser)

module.exports = router;

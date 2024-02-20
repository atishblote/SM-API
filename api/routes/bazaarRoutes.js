const express = require('express')
const router = express.Router()
const Bazaar = require('../controllers/bazaarController')
// const { route } = require('../../app')
//controlers


router.get("/" , Bazaar.getAllBazaar)
router.post("/create" , Bazaar.createBazaar)
router.put("/bazaar-active" , Bazaar.activeBazaar)
router.delete("/:id" , Bazaar.deleteBazaar)
router.put("/update" , Bazaar.updateBazaar)
// router.get("/:id" , Users.getSingleUsers)
// router.delete("/:id" , Users.deleteUser)
// router.post("/multiple-delete" , Users.deleteMultipleUsers)
// router.post("/login" , Users.loginuser)

// dashboard
router.get("/regular" , Bazaar.bazaarMultiData)

module.exports = router;

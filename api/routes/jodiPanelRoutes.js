const express = require('express')
const router = express.Router()
const JodiPanel = require('../controllers/jodiPanelController')
// const { route } = require('../../app')
//controlers


router.get("/" , JodiPanel.getAllJodiPanel)
router.post("/create" , JodiPanel.createJodiPanel)
router.get("/:id" , JodiPanel.getSingleJodiPanel)
router.put("/update" , JodiPanel.getUpdateJodiPanel)
router.get("/find-panel/:id" , JodiPanel.getPanelByDate)
router.delete("/:id" , JodiPanel.deleteodiPanel)
router.post("/multiple-delete" , JodiPanel.deleteMultipleJodiPanel)




// router.post("/login" , Users.loginuser)

module.exports = router;

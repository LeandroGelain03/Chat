const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post("/storeMessage", chatController.storeMessage);
router.get("/getPreviousMessages", chatController.getPreviousMessage);

module.exports = router;
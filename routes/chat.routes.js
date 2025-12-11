const express = require('express');
const router = express.Router();
const {
    getConversations,
    getMessages,
    startConversation
} = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:conversationId/messages', getMessages);
router.post('/conversation', startConversation);

module.exports = router;

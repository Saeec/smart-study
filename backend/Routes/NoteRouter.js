// backend/Routes/NoteRouter.js

const express = require('express');
const router = express.Router();
const noteController = require('../Controllers/NoteController');
const verifyToken = require('../Middlewares/verifyToken');

// Protect all note-related routes
router.use(verifyToken);

router.get('/', noteController.getNotes);
router.post('/', noteController.addNote);
router.delete('/:noteId', noteController.deleteNote);

// Special route to trigger the AI summarization
router.post('/:noteId/summarize', noteController.summarizeNote);

module.exports = router;

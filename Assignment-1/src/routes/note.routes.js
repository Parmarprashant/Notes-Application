const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');

// Bulk routes first to avoid conflict with /:id
router.post('/bulk', noteController.createBulkNotes);
router.delete('/bulk', noteController.deleteBulkNotes);

router.get('/', noteController.getAllNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.replaceNote);
router.patch('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.post('/', noteController.createNote);

module.exports = router;

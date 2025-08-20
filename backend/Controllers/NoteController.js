// backend/Controllers/NoteController.js

const Note = require('../Models/Note');

// --- Standard CRUD Operations ---

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes', error });
    }
};

exports.addNote = async (req, res) => {
    const { title, content, subject } = req.body;
    if (!title || !content || !subject) {
        return res.status(400).json({ message: 'Title, content, and subject are required' });
    }
    try {
        const newNote = new Note({ title, content, subject, user: req.user.id });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error adding note', error });
    }
};

exports.deleteNote = async (req, res) => {
    const { noteId } = req.params;
    try {
        const note = await Note.findOneAndDelete({ _id: noteId, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error });
    }
};

// --- AI Summarization Function ---

exports.summarizeNote = async (req, res) => {
    const { noteId } = req.params;
    const apiKey = ""; // API key will be provided by the environment

    try {
        // 1. Find the note in the database
        const note = await Note.findOne({ _id: noteId, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // 2. Prepare the request for the Gemini API
        const prompt = `Summarize the following study notes in a few key bullet points:\n\n---\n\n${note.content}`;
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        // 3. Call the Gemini API
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            throw new Error(`API call failed with status: ${apiResponse.status}`);
        }

        const result = await apiResponse.json();
        
        // 4. Extract the summary text from the response
        const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!summaryText) {
            return res.status(500).json({ message: 'Failed to generate summary from API response.' });
        }

        // 5. Save the summary to the note and return it
        note.summary = summaryText.trim();
        await note.save();

        res.status(200).json(note);

    } catch (error) {
        console.error("Summarization error:", error);
        res.status(500).json({ message: 'Error summarizing note', error: error.message });
    }
};

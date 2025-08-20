// backend/Controllers/TimerController.js

const Subject = require('../Models/Subject');
const Session = require('../Models/Session');

// --- Subject Controllers ---

// Get all subjects for the logged-in user
exports.getSubjects = async (req, res) => {
  try {
    // req.user.id is attached by the verifyToken middleware
    const subjects = await Subject.find({ user: req.user.id });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

// Add a new subject for the logged-in user
exports.addSubject = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Subject name is required' });
  }

  try {
    const newSubject = new Subject({
      name,
      user: req.user.id,
    });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subject', error });
  }
};

// --- Session Controllers ---

// Get all sessions for the logged-in user
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user.id }).sort({ createdAt: -1 }); // Newest first
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};

// Add a new session for the logged-in user
exports.addSession = async (req, res) => {
  const { subject, duration } = req.body;
  if (!subject || !duration) {
    return res.status(400).json({ message: 'Subject and duration are required' });
  }

  try {
    const newSession = new Session({
      subject,
      duration,
      user: req.user.id,
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ message: 'Error adding session', error });
  }
};

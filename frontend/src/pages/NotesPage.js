import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const NotesPage = () => {
  const token = localStorage.getItem("token");
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loadingNoteId, setLoadingNoteId] = useState(null);

  // ✅ Fetch all notes & subjects together
  const fetchData = useCallback(async () => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const [notesRes, subjectsRes] = await Promise.all([
        axios.get("/api/notes", config),
        axios.get("/api/timer/subjects", config),
      ]);

      setNotes(notesRes.data);
      setSubjects(subjectsRes.data);

      if (subjectsRes.data.length > 0) {
        setSelectedSubject((prev) => prev || subjectsRes.data[0].name);
      }
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  }, [token]);

  // ✅ Fetch only subjects when needed
  const fetchSubjects = useCallback(async () => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const subjectsRes = await axios.get("/api/timer/subjects", config);
      setSubjects(subjectsRes.data);

      if (subjectsRes.data.length > 0) {
        setSelectedSubject((prev) => prev || subjectsRes.data[0].name);
      }
    } catch (error) {
      console.error("❌ Error fetching subjects:", error);
    }
  }, [token]);

  // ✅ On mount → fetch data + listen for updates from TimerPage
  useEffect(() => {
    fetchData();

    const handleSubjectsUpdate = () => {
      fetchSubjects();
    };

    window.addEventListener("subjectsUpdated", handleSubjectsUpdate);
    return () => {
      window.removeEventListener("subjectsUpdated", handleSubjectsUpdate);
    };
  }, [fetchData, fetchSubjects]);

  // ✅ Add new note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !selectedSubject) {
      alert("⚠️ Please fill out all fields.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(
        "/api/notes",
        { title, content, subject: selectedSubject },
        config
      );

      setTitle("");
      setContent("");
      await fetchData(); // refresh notes instantly
    } catch (error) {
      console.error("❌ Error adding note:", error);
      alert("Failed to add note. Please try again.");
    }
  };

  // ✅ Delete note
  const handleDeleteNote = async (noteId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/notes/${noteId}`, config);
      await fetchData();
    } catch (error) {
      console.error("❌ Error deleting note:", error);
    }
  };

  // ✅ Summarize note with AI
  const handleSummarize = async (noteId) => {
    setLoadingNoteId(noteId);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`/api/notes/${noteId}/summarize`, {}, config);
      await fetchData();
    } catch (error) {
      console.error("❌ Error summarizing note:", error);
      alert("Failed to summarize note. Please try again.");
    } finally {
      setLoadingNoteId(null);
    }
  };

  return (
    <div>
      <h1 className="home-title" style={{ marginBottom: "2rem" }}>
        Study Notes
      </h1>

      <div className="notes-layout">
        {/* 📌 Add New Note */}
        <div className="add-note-container">
          <h3 className="stats-header">Add a New Note</h3>
          <form onSubmit={handleAddNote} className="add-note-form">
            <input
              type="text"
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />

            <div className="subject-select-wrapper">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="subject-select"
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={fetchSubjects}
                className="btn btn-secondary"
                style={{ marginLeft: "8px" }}
              >
                🔄 Refresh
              </button>
            </div>

            <textarea
              placeholder="Write your notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input note-textarea"
            />
            <button type="submit" className="btn btn-primary">
              Save Note
            </button>
          </form>
        </div>

        {/* 📌 Notes List */}
        <div className="notes-list-container">
          <h3 className="stats-header">Your Notes</h3>
          <div className="notes-list">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="note-item">
                  <div className="note-header">
                    <div>
                      <p className="note-title">{note.title}</p>
                      <p className="note-subject">{note.subject}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="note-content">{note.content}</p>

                  {note.summary && (
                    <div className="note-summary">
                      <h4>AI Summary:</h4>
                      <pre>{note.summary}</pre>
                    </div>
                  )}

                  <button
                    onClick={() => handleSummarize(note._id)}
                    disabled={loadingNoteId === note._id}
                    className="btn btn-summarize"
                  >
                    {loadingNoteId === note._id
                      ? "Summarizing..."
                      : "Summarize with AI"}
                  </button>
                </div>
              ))
            ) : (
              <p>You haven't created any notes yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;

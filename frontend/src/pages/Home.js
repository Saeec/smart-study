// frontend/src/pages/Home.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const Home = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    // State for timer logic
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    // State for data
    const [subjects, setSubjects] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [newSubject, setNewSubject] = useState('');

    const intervalRef = useRef(null); // To hold the interval ID

    // --- API Calls ---
    const fetchData = useCallback(async () => {
        if (!token) return;
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const [subjectsRes, sessionsRes] = await Promise.all([
                axios.get('/api/timer/subjects', config),
                axios.get('/api/timer/sessions', config)
            ]);
            setSubjects(subjectsRes.data);
            setSessions(sessionsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;
        try {
            await axios.post('/api/timer/subjects', { name: newSubject }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNewSubject('');
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    const saveSession = useCallback(async (duration) => {
        if (duration < 10 || !selectedSubject) return; // Don't save short sessions
        try {
            await axios.post('/api/timer/sessions', { subject: selectedSubject, duration }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error saving session:", error);
        }
    }, [selectedSubject, token, fetchData]);


    // --- Timer Logic ---
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        saveSession(25 * 60); // Save full session
                        return 25 * 60; // Reset
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning, saveSession]);

    const handleStart = () => {
        if (!selectedSubject) {
            alert("Please select a subject first!");
            return;
        }
        setIsRunning(true);
    };

    const handlePause = () => setIsRunning(false);

    const handleReset = () => {
        setIsRunning(false);
        const elapsed = (25 * 60) - seconds;
        if (elapsed > 0) {
            saveSession(elapsed);
        }
        setSeconds(25 * 60);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };
    
    // --- Analytics Calculation ---
    const subjectTotals = sessions.reduce((acc, session) => {
        acc[session.subject] = (acc[session.subject] || 0) + session.duration;
        return acc;
    }, {});


    return (
        <div className="page-container-large" style={{textAlign: 'left'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 className="home-title">Welcome, {user?.name}!</h1>
                <button onClick={handleLogout} className="btn btn-danger" style={{width: 'auto', marginTop: 0}}>Logout</button>
            </div>

            <section className="timer-section">
                <div style={{textAlign: 'center'}}>
                    <div className="timer-display">{formatTime(seconds)}</div>
                    <div className="controls-section">
                        {!isRunning ? (
                            <button onClick={handleStart} className="btn btn-start">Start</button>
                        ) : (
                            <button onClick={handlePause} className="btn btn-pause">Pause</button>
                        )}
                        <button onClick={handleReset} className="btn btn-reset">Reset</button>
                    </div>
                </div>
            </section>

            <section className="subject-section">
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="subject-select">
                    <option value="">-- Select a Subject --</option>
                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
                <input 
                    type="text" 
                    value={newSubject} 
                    onChange={e => setNewSubject(e.target.value)} 
                    placeholder="New subject..." 
                    className="form-input"
                />
                <button onClick={handleAddSubject} className="btn btn-add">Add</button>
            </section>

            <div className="stats-grid">
                <section>
                    <h3 className="stats-header">Total Time per Subject</h3>
                    <div className="stats-container">
                        {Object.keys(subjectTotals).length > 0 ? Object.entries(subjectTotals).map(([subject, total]) => (
                            <div key={subject} className="stats-item">
                                <span className="item-subject">{subject}</span>
                                <span className="item-duration">{Math.floor(total / 60)} min</span>
                            </div>
                        )) : <p>No sessions recorded yet.</p>}
                    </div>
                </section>
                <section>
                    <h3 className="stats-header">Recent Sessions</h3>
                    <div className="history-container">
                        {sessions.length > 0 ? sessions.slice(0, 5).map(session => (
                             <div key={session._id} className="history-item">
                                <div>
                                    <p className="item-subject">{session.subject}</p>
                                    <p className="item-date">{new Date(session.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className="item-duration">{Math.floor(session.duration / 60)} min</span>
                            </div>
                        )) : <p>Your recent sessions will appear here.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;

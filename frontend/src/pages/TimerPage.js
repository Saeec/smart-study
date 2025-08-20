// frontend/src/pages/TimerPage.js

import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const TimerPage = () => {
    const token = localStorage.getItem('token');

    // State for timer logic
    const [seconds, setSeconds] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    // State for data
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [newSubject, setNewSubject] = useState('');

    const intervalRef = useRef(null); // To hold the interval ID

    const fetchSubjects = useCallback(async () => {
        if (!token) return;
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        try {
            const subjectsRes = await axios.get('/api/timer/subjects', config);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchSubjects();
    }, [fetchSubjects]);

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;
        try {
            await axios.post('/api/timer/subjects', { name: newSubject }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNewSubject('');
            fetchSubjects(); // Refresh subjects
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    const saveSession = useCallback(async (duration) => {
        if (duration < 10 || !selectedSubject) return;
        try {
            await axios.post('/api/timer/sessions', { subject: selectedSubject, duration }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Session is saved, user can see it on the dashboard
        } catch (error) {
            console.error("Error saving session:", error);
        }
    }, [selectedSubject, token]);


    // --- Timer Logic ---
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        saveSession(25 * 60); // Save full session
                        alert("Session complete! Time for a break.");
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

    return (
        <div>
            <h1 className="home-title" style={{ marginBottom: '2rem' }}>Pomodoro Timer</h1>

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
                    placeholder="Add new subject..." 
                    className="form-input"
                />
                <button onClick={handleAddSubject} className="btn btn-add">Add</button>
            </section>
        </div>
    );
};

export default TimerPage;

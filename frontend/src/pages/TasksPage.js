// frontend/src/pages/TasksPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TasksPage = () => {
    const token = localStorage.getItem('token');
    const [tasks, setTasks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    
    // Form state for adding a new task
    const [title, setTitle] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');

    // Fetch initial data (tasks and subjects) from the backend
    const fetchData = useCallback(async () => {
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const [tasksRes, subjectsRes] = await Promise.all([
                axios.get('/api/tasks', config),
                axios.get('/api/timer/subjects', config)
            ]);
            setTasks(tasksRes.data);
            setSubjects(subjectsRes.data);
            // Set a default subject in the form if subjects exist
            if (subjectsRes.data.length > 0 && !selectedSubject) {
                setSelectedSubject(subjectsRes.data[0].name);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [token, selectedSubject]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handler for submitting the new task form
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title || !selectedSubject) {
            alert('Please provide a title and select a subject.');
            return;
        }
        const newTask = { title, subject: selectedSubject, deadline, priority };
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post('/api/tasks', newTask, config);
            // Reset form fields and refetch all data to show the new task
            setTitle('');
            setDeadline('');
            setPriority('Medium');
            fetchData();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Handler to toggle a task's completion status
    const handleToggleComplete = async (task) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`/api/tasks/${task._id}`, { completed: !task.completed }, config);
            fetchData(); // Refetch data to show the change
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Handler to delete a task
    const handleDeleteTask = async (taskId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`/api/tasks/${taskId}`, config);
            fetchData(); // Refetch data to remove the task from the list
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div>
            <h1 className="home-title" style={{ marginBottom: '2rem' }}>Task Planner</h1>
            
            {/* Add Task Form */}
            <form onSubmit={handleAddTask} className="add-task-form">
                <input 
                    type="text" 
                    placeholder="Task title..." 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    className="form-input"
                />
                <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="subject-select">
                    <option value="">-- Select Subject --</option>
                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                </select>
                <input 
                    type="date" 
                    value={deadline} 
                    onChange={e => setDeadline(e.target.value)}
                    className="form-input"
                />
                <select value={priority} onChange={e => setPriority(e.target.value)} className="subject-select">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <button type="submit" className="btn btn-add">Add Task</button>
            </form>

            {/* Task List */}
            <div className="task-list">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority.toLowerCase()}`}>
                        <div className="task-item-main">
                            <input 
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => handleToggleComplete(task)} 
                            />
                            <div>
                                <p className="task-title">{task.title}</p>
                                <p className="task-subject">{task.subject}</p>
                            </div>
                        </div>
                        <div className="task-item-details">
                            <span className="task-deadline">
                                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                            </span>
                            <span className={`task-priority`}>{task.priority}</span>
                            <button onClick={() => handleDeleteTask(task._id)} className="btn-delete">Delete</button>
                        </div>
                    </div>
                )) : <p>You have no tasks. Add one above!</p>}
            </div>
        </div>
    );
};

export default TasksPage;

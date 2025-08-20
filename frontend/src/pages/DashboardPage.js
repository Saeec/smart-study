// frontend/src/pages/DashboardPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
    const token = localStorage.getItem('token');
    const [chartData, setChartData] = useState({ weeklyBarChartData: [] });
    const [sessions, setSessions] = useState([]);

    const fetchData = useCallback(async () => {
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            // Fetch both chart data and recent sessions
            const [chartRes, sessionsRes] = await Promise.all([
                axios.get('/api/dashboard/stats', config),
                axios.get('/api/timer/sessions', config)
            ]);
            setChartData(chartRes.data);
            setSessions(sessionsRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div>
            <h1 className="home-title" style={{ marginBottom: '2rem' }}>Dashboard</h1>
            
            <div className="chart-container">
                <h3 className="stats-header">Weekly Study Report </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.weeklyBarChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{marginTop: '2rem'}}>
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
            </div>
        </div>
    );
};

export default DashboardPage;
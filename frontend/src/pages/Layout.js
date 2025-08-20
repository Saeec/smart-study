// frontend/src/pages/Layout.js

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className="layout-container">
            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-header-top">
                        <h2 className="sidebar-title">Smart Study</h2>
                        {/* Button is now inside the header */}
                        <button onClick={() => setIsCollapsed(!isCollapsed)} className="sidebar-toggle-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <p className="sidebar-user">Welcome, {user?.name}!</p>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Tasks
                    </NavLink>
                    <NavLink to="/timer" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Timer
                    </NavLink>
                    <NavLink to="/notes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Notes
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;

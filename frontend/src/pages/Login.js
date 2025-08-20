// frontend/src/pages/Login.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2 className="form-title">Welcome Back!</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="text-label">Email</label>
                    <input type="email" name="email" onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-group">
                    <label className="text-label">Password</label>
                    <input type="password" name="password" onChange={handleChange} required className="form-input" />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <p className="form-footer-text">
                Don't have an account? <Link to="/signup" className="link">Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;

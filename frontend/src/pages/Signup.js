// frontend/src/pages/Signup.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('/api/auth/signup', formData);
            setSuccess(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h2 className="form-title">Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="text-label">Name</label>
                    <input type="text" name="name" onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-group">
                    <label className="text-label">Email</label>
                    <input type="email" name="email" onChange={handleChange} required className="form-input" />
                </div>
                <div className="form-group">
                    <label className="text-label">Password</label>
                    <input type="password" name="password" onChange={handleChange} required className="form-input" />
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <p className="form-footer-text">
                Already have an account? <Link to="/login" className="link">Login</Link>
            </p>
        </div>
    );
};

export default Signup;

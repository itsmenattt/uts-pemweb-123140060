import React, { useState } from 'react';
import './LoginModal.css'; 

function LoginModal({ isVisible, onClose, onLogin, onSwitchToRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isVisible) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        const success = onLogin(username, password);

        if (success) {
            setUsername('');
            setPassword('');
            onClose(); 
        } else {
            setError('Username atau password salah.');
        }
    };

    const handleClose = () => {
        setError(''); 
        onClose();
    }

    return (
        <div className="login-modal-overlay" onClick={handleClose}>
            <div className="login-modal-content" onClick={e => e.stopPropagation()}>
                {}
                <button className="close-button" onClick={handleClose}>&times;</button>
                <h2>Login Pengguna</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="login-error-msg">{error}</p>}
                    
                    <button type="submit" className="login-btn">Masuk</button>
                </form>
                
                <p className="switch-link" onClick={onSwitchToRegister}>
                    Belum punya akun? Daftar di sini
                </p>
            </div>
        </div>
    );
}

export default LoginModal;
import React, { useState } from 'react';
import './LoginModal.css'; 

function RegisterModal({ isVisible, onClose, onRegister, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isVisible) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (username.length < 3 || password.length < 3) {
            setError('Username dan password minimal 3 karakter.');
            return;
        }
        
        const success = onRegister(username, password);

        if (success) {
            onClose(); 
            setUsername('');
            setPassword('');
        } else {
            setError('Username sudah digunakan. Coba nama lain.');
        }
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div className="login-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Buat Akun Baru</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reg-username">Username:</label>
                        <input
                            type="text"
                            id="reg-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reg-password">Password:</label>
                        <input
                            type="password"
                            id="reg-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {error && <p className="login-error-msg">{error}</p>}
                    
                    <button type="submit" className="login-btn">Daftar & Masuk</button>
                </form>
                
                <p className="switch-link" onClick={onSwitchToLogin}>
                    Sudah punya akun? Masuk di sini
                </p>
            </div>
        </div>
    );
}

export default RegisterModal;
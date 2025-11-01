// src/components/Footer.jsx

import React from 'react';
import './Footer.css'; 

function Footer({ nim, nama }) {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="app-footer">
            <div className="container footer-content">
                <div className="footer-left">
                    <p>&copy; {currentYear} Movie Explorer. Hak Cipta Dilindungi.</p>
                    <p className="footer-source">Data didukung oleh: <a href="https://www.omdbapi.com/" target="_blank" rel="noopener noreferrer">OMDb API</a></p>
                </div>
                
                <div className="footer-right">
                    <p>UTS Pemrograman Web</p>
                    <p className="credit-text">Dibuat oleh: {nama || "Nama/NIM Anda"}</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
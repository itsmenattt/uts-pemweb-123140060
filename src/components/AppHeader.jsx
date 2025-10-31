// src/components/AppHeader.jsx

import { useState } from 'react'; 
import './AppHeader.css';

function AppHeader({ onToggleFilter, isFilterActive, isLoggedIn, onLoginClick, onLogout, onNavFilter, onSearch }) { 
    // State lokal untuk search bar di hero (sudah tidak terpakai di sini, tapi dipertahankan jika nanti ada search hero lagi)
    const [heroSearchQuery, setHeroSearchQuery] = useState('');

    const handleHeroSearch = (e) => {
        e.preventDefault();
        if (heroSearchQuery.trim()) {
            onSearch({ title: heroSearchQuery, year: '', type: 'movie' });
            setHeroSearchQuery(''); 
        }
    };

    return (
        <header className="hero-section"> 
            
            {/* Navbar Utama */}
            <div className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-left">
                        <div className="logo">Movie Explorer</div>
                        <nav className="main-nav">
                            <div className="nav-item-functional" onClick={() => onNavFilter('movie')} tabIndex="0">Movies</div>
                            <div className="nav-item-functional" onClick={() => onNavFilter('series')} tabIndex="0">TV Shows</div>
                            <div className="nav-item-functional" onClick={() => onNavFilter('more')} tabIndex="0">More</div>
                        </nav>
                    </div>
                    <div className="navbar-right">
                        <button 
                            className={`search-icon-btn ${isFilterActive ? 'is-active' : ''}`} 
                            onClick={onToggleFilter}
                            title={isFilterActive ? 'Sembunyikan Filter Lanjutan' : 'Tampilkan Filter Lanjutan'}
                            aria-label="Tampilkan atau Sembunyikan Filter Pencarian Lanjutan" 
                            tabIndex="0"
                        >
                            🔍
                        </button>
                        {isLoggedIn ? (
                            <div className="nav-item-functional" onClick={onLogout} tabIndex="0">Logout</div>
                        ) : (
                            <div className="nav-item-functional" onClick={onLoginClick} tabIndex="0">Login</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Overlay - Ini adalah div yang salah */}
            <div className="hero-overlay"> 
                <div className="container header-content">
                    <div className="hero-text">
                        {/* HAPUS BARIS INI: */}
                        {/* <h2>Jutaan film, acara TV, dan orang untuk dijelajahi. Cari tahu sekarang.</h2> */}
                        
                        {/* Pastikan H1 juga dihapus jika tidak lagi diperlukan di AppHeader */}
                        {/* <h1>Selamat datang.</h1> */} 
                        
                        {/* Form search bar ini juga harusnya sudah dihapus karena diganti HeroOverlay terpisah */}
                        {/* <form onSubmit={handleHeroSearch} className="hero-search-form">
                            <input 
                                type="text" 
                                placeholder="Cari film, acara TV, orang..."
                                value={heroSearchQuery}
                                onChange={(e) => setHeroSearchQuery(e.target.value)}
                            />
                            <button type="submit">Search</button>
                        </form> */}
                    </div>
                </div>
            </div>
        </header>
    );
}
export default AppHeader;
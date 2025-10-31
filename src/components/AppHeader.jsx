import { useState } from 'react'; 
import './AppHeader.css';

function AppHeader({ onToggleFilter, isFilterActive, isLoggedIn, onLoginClick, onLogout, onNavFilter, onSearch }) { 
    const heroImageUrl = 'https://images.unsplash.com/photo-1536440136659-142a78dc1241?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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

            <div className="hero-overlay"> 
                <div className="container header-content">
                    <div className="hero-text">
                        <h1>Selamat datang.</h1>
                        <h2>Jutaan film, acara TV, dan orang untuk dijelajahi. Cari tahu sekarang.</h2>      
                    </div>
                </div>
            </div>
        </header>
    );
}
export default AppHeader;
import { useState } from 'react'; 
import './AppHeader.css';

function AppHeader({ onToggleFilter, isFilterActive, isLoggedIn, onLoginClick, onLogout, onNavFilter, onSearch }) { 
    
    return (
        <header className="navbar-fixed">
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

        </header>
    );
}
export default AppHeader;
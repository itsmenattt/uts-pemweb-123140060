import { useState } from 'react'; 
import './AppHeader.css';

// Hapus props isLoggedIn, onLoginClick, onLogout

function AppHeader({ onToggleFilter, isFilterActive, onNavFilter, onSearch }) { 
    
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
                            {/* START PERUBAHAN KRITIS */}
                            <img 
                                src="/button_search.png" 
                                alt="Ikon Pencarian" 
                                className="search-icon-img" 
                            />
                            {/* END PERUBAHAN KRITIS */}
                        </button>
                        
                        {/* Hapus elemen Login/Logout */}
                        
                    </div>
                </div>
            </div>

        </header>
    );
}

export default AppHeader;
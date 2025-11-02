import { useState } from 'react'; 
import './AppHeader.css';

function AppHeader({ 
    onToggleFilter, isFilterActive, onNavFilter, onSearch, 
    isLoggedIn, onLoginClick, onLogout, onShowFavorites, onGoHome 
}) { 
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = (action) => {
        setIsMenuOpen(false); 
        
        if (action === 'login') {
            onLoginClick();
        } else if (action === 'logout') {
            onLogout();
        } else if (action === 'favorites') {
            onShowFavorites(); 
        }
    };
    
    const menuIcon = isMenuOpen ? '✕' : '☰'; 

    return (
        <header className="navbar-fixed">
            <div className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-left">
                        <div className="logo" onClick={onGoHome}>Movie Explorer</div>
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
                            title={isFilterActive ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                            aria-label="Toggle Search Filter" 
                            tabIndex="0"
                        >
                            <img 
                                src="/button_search.png" 
                                alt="Search Icon" 
                                className="search-icon-img" 
                            />
                        </button>
                        
                        <div className="burger-menu-wrapper">
                            <button 
                                className="burger-menu-toggle"
                                onClick={() => setIsMenuOpen(prev => !prev)}
                                aria-expanded={isMenuOpen}
                                aria-label="Menu Pengguna"
                            >
                                {menuIcon}
                            </button>
                            
                            {isMenuOpen && (
                                <div className="burger-menu-dropdown">
                                    <div 
                                        className="dropdown-item" 
                                        onClick={() => handleMenuClick('favorites')}
                                        tabIndex="0"
                                    >
                                        ⭐ Favorites
                                    </div>
                                    
                                    {isLoggedIn ? (
                                        <div 
                                            className="dropdown-item" 
                                            onClick={() => handleMenuClick('logout')}
                                            tabIndex="0"
                                        >
                                            Logout
                                        </div>
                                    ) : (
                                        <div 
                                            className="dropdown-item primary-action" 
                                            onClick={() => handleMenuClick('login')}
                                            tabIndex="0"
                                        >
                                            👤 Login / Register
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>

        </header>
    );
}

export default AppHeader;
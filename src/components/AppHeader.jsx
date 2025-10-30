import './AppHeader.css';

// UPDATE: Terima props Login/Logout & onNavFilter
function AppHeader({ onToggleFilter, isFilterActive, isLoggedIn, onLoginClick, onLogout, onNavFilter }) { 
    const heroImageUrl = 'https://images.unsplash.com/photo-1536440136659-142a78dc1241?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <header className="hero-section" style={{ backgroundImage: `url(${heroImageUrl})` }}>
            
            <div className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-left">
                        <div className="logo">Movie Explorer</div>
                        <nav className="main-nav">
                            <div className="nav-item-functional" onClick={() => onNavFilter('movie')}>Movies</div>
                            <div className="nav-item-functional" onClick={() => onNavFilter('series')}>TV Shows</div>
                            <div className="nav-item-functional" onClick={() => onNavFilter('more')}>More</div>
                        </nav>
                    </div>
                    <div className="navbar-right">
                        <button 
                            className={`search-icon-btn ${isFilterActive ? 'is-active' : ''}`} 
                            onClick={onToggleFilter}
                            title={isFilterActive ? 'Sembunyikan Filter Lanjutan' : 'Tampilkan Filter Lanjutan'}
                        >
                            🔍
                        </button>
                        {isLoggedIn ? (
                            <div className="nav-item-functional" onClick={onLogout}>Logout</div>
                        ) : (
                            <div className="nav-item-functional" onClick={onLoginClick}>Login</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="hero-overlay"> 
                <div className="container header-content">
                    <div className="hero-text">
                    </div>
                </div>
            </div>
        </header>
    );
}
export default AppHeader;
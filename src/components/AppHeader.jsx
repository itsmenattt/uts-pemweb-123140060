import './AppHeader.css';

function AppHeader({ onToggleFilter, isFilterActive }) { 
    const heroImageUrl = 'https://images.unsplash.com/photo-1536440136659-142a78dc1241?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <header className="hero-section" style={{ backgroundImage: `url(${heroImageUrl})` }}>
            
            {}
            <div className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-left">
                        {}
                        <div className="logo">Movie Explorer</div>
                        <nav className="main-nav">
                            <a href="#" className="nav-item">Movies</a>
                            <a href="#" className="nav-item">TV Shows</a>
                            <a href="#" className="nav-item more-item">More</a>
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
                        <a href="#" className="nav-item">Login</a>
                        {}
                        {}
                    </div>
                </div>
            </div>

            {}
            <div className="hero-overlay"> 
                <div className="container header-content">
                    <div className="hero-text">
                        {}
                    </div>
                </div>
            </div>
        </header>
    );
}
export default AppHeader;
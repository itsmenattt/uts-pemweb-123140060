// src/components/AppHeader.jsx
import './AppHeader.css';

// Fungsi Handler untuk Login/Menu
const handleNavClick = (featureName) => {
    alert(`Fitur ${featureName} belum diimplementasikan untuk UTS ini.`);
    console.log(`Navigasi diklik: ${featureName}`);
};

function AppHeader({ onToggleFilter, isFilterActive }) { 
    const heroImageUrl = 'https://images.unsplash.com/photo-1536440136659-142a78dc1241?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <header className="hero-section" style={{ backgroundImage: `url(${heroImageUrl})` }}>
            
            {/* Navbar Utama */}
            <div className="navbar">
                <div className="container navbar-content">
                    <div className="navbar-left">
                        <div className="logo">Movie Explorer</div>
                        <nav className="main-nav">
                            {/* Mengubah link menjadi div/button agar bisa memanggil handler */}
                            <div className="nav-item-functional" onClick={() => handleNavClick('Movies')}>Movies</div>
                            <div className="nav-item-functional" onClick={() => handleNavClick('TV Shows')}>TV Shows</div>
                            <div className="nav-item-functional" onClick={() => handleNavClick('More')}>More</div>
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
                        {/* Tombol Login */}
                        <div className="nav-item-functional" onClick={() => handleNavClick('Login')}>Login</div>
                        {/* Tombol Join TMDB dihapus */}
                    </div>
                </div>
            </div>
            
        </header>
    );
}
export default AppHeader;
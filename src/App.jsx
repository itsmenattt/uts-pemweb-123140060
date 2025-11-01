// src/App.jsx

import { useState, useEffect, useCallback } from 'react';
import './App.css';
import AppHeader from './components/AppHeader'; 
import MovieFilter from './components/MovieFilter'; 
import SearchResult from './components/SearchResult'; 
import MovieModal from './components/MovieModal'; 
import Footer from './components/Footer'; 
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal'; // <-- IMPORT BARU

// --- (Fungsi shuffleArray dan getApiKey tetap sama) ---
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const getApiKey = () => {
    const rawKey = import.meta.env.VITE_OMDB_API_KEY;
    return rawKey ? rawKey.trim() : null; 
};

const API_KEY = getApiKey();
const API_URL = API_KEY ? `https://www.omdbapi.com/?apikey=${API_KEY}` : '';

// --- FUNGSI BARU: Untuk memuat dan menyimpan database pengguna ---
const loadUsersDB = () => {
    const db = localStorage.getItem('movieAppUsers');
    return db ? JSON.parse(db) : {};
};

const saveUsersDB = (db) => {
    localStorage.setItem('movieAppUsers', JSON.stringify(db));
};


function App() {
  // --- STATE FILM & API ---
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  
  // --- STATE MODAL DETAIL FILM ---
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);
  
  // --- STATE FILTER ---
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(true); 

  // --- STATE BARU: Manajemen Akun & Favorit ---
  const [users, setUsers] = useState(loadUsersDB()); // Database semua pengguna
  const [currentUser, setCurrentUser] = useState(null); // Username yang sedang login
  const [favorites, setFavorites] = useState([]); // Favorit milik currentUser
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false); // Modal baru


  // --- EFEK BARU: Cek sesi login saat aplikasi dimuat ---
  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser && users[loggedInUser]) {
        setCurrentUser(loggedInUser);
        setFavorites(users[loggedInUser].favorites || []);
    }
  }, []); // [] = Hanya berjalan sekali saat mount

  
  // --- (Fungsi Navigasi & Pencarian tidak berubah) ---
  const handleNavFilter = (navType) => {
      let query = { title: 'popular', year: '', type: 'movie' }; 
      switch (navType) {
          case 'movie': query = { title: 'action', year: '', type: 'movie' }; break;
          case 'series': query = { title: 'drama', year: '', type: 'series' }; break;
          case 'more': query = { title: 'comedy', year: '', type: 'movie' }; break;
          default: break;
      }
      setSearchQuery(query);
      setIsAdvancedFilterVisible(false); 
  };
  const handleSearch = (query) => { setSearchQuery(query); };
  const toggleAdvancedFilter = () => { setIsAdvancedFilterVisible(prev => !prev); };

  // --- (Fungsi Modal Film tidak berubah) ---
  const handleMovieClick = (imdbID) => { setSelectedMovieId(imdbID); };
  const handleCloseMovieModal = () => {
    setSelectedMovieId(null);
    setMovieDetail(null);
  };

  // --- MODIFIKASI KRITIS: `toggleFavorite` kini bergantung pada `currentUser` ---
  const toggleFavorite = useCallback((movie) => {
    if (!currentUser) {
        alert('Anda harus login untuk menambah favorit!');
        return;
    }

    setFavorites(prevFavorites => {
        const isFavorite = prevFavorites.some(fav => fav.imdbID === movie.imdbID);
        let newFavorites;

        if (isFavorite) {
            newFavorites = prevFavorites.filter(fav => fav.imdbID !== movie.imdbID);
        } else {
            newFavorites = [...prevFavorites, movie];
        }

        // Simpan favorit ke database pengguna yang sedang login
        const updatedUser = { ...users[currentUser], favorites: newFavorites };
        const updatedUsersDB = { ...users, [currentUser]: updatedUser };
        
        setUsers(updatedUsersDB); // Update state database
        saveUsersDB(updatedUsersDB); // Simpan ke localStorage

        return newFavorites;
    });
  }, [currentUser, users]); 

  // --- FUNGSI BARU: Manajemen Modal Login/Register ---
  const openLoginModal = () => {
    setIsRegisterModalVisible(false);
    setIsLoginModalVisible(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalVisible(false);
    setIsRegisterModalVisible(true);
  };

  const closeAllModals = () => {
    setIsLoginModalVisible(false);
    setIsRegisterModalVisible(false);
  };


  // --- MODIFIKASI: Logika Login ---
  const handleLoginAttempt = (username, password) => {
    const user = users[username];

    if (user && user.password === password) {
        setCurrentUser(username);
        setFavorites(user.favorites || []);
        localStorage.setItem('currentUser', username); // Simpan sesi
        closeAllModals();
        return true; 
    }
    return false; // Gagal login
  };

  // --- FUNGSI BARU: Logika Register ---
  const handleRegisterAttempt = (username, password) => {
    if (users[username]) {
        return false; // Username sudah ada
    }

    // Buat pengguna baru
    const newUser = { password: password, favorites: [] };
    const updatedUsersDB = { ...users, [username]: newUser };
    
    setUsers(updatedUsersDB);
    saveUsersDB(updatedUsersDB);

    // Otomatis login setelah daftar
    setCurrentUser(username);
    setFavorites([]);
    localStorage.setItem('currentUser', username);
    
    closeAllModals();
    return true;
  };

  // --- MODIFIKASI: Logika Logout ---
  const handleLogout = () => {
    setCurrentUser(null);
    setFavorites([]);
    localStorage.removeItem('currentUser'); // Hapus sesi
  };

  // --- ( useEffect untuk memuat film awal tidak berubah ) ---
  useEffect(() => {
      if (!API_KEY || movies.length > 0 || searchQuery !== null) return; 
      const fetchInitialMovies = async () => {
          setLoading(true);
          setError(null);
          const keywords = ['best', 'adventure', 'thriller']; 
          const urls = keywords.map(keyword => `${API_URL}&s=${keyword}&page=1`);
          try {
              const responses = await Promise.all(urls.map(url => fetch(url)));
              const data = await Promise.all(responses.map(res => res.json()));
              let combinedResults = [];
              data.forEach(d => {
                  if (d.Response === 'True' && d.Search) {
                      combinedResults = combinedResults.concat(d.Search);
                  }
              });
              if (combinedResults.length > 0) {
                  const filteredResults = combinedResults.filter(movie => {
                      const hasPoster = movie.Poster && movie.Poster !== 'N/A';
                      const releaseYear = parseInt(movie.Year);
                      const isRecent = !isNaN(releaseYear) && releaseYear >= 1990; 
                      return hasPoster && isRecent;
                  });
                  const shuffledResults = shuffleArray(filteredResults);
                  setMovies(shuffledResults.slice(0, 15)); 
                  setLoading(false);
              } else {
                  setError("Error: Tidak ada hasil. Periksa API Key Anda."); 
                  setLoading(false);
              }
          } catch (error) {
              setError('Gagal memuat film awal. Periksa koneksi atau API Key.');
              setLoading(false);
          }
      };
      fetchInitialMovies();
  }, [API_KEY, API_URL, searchQuery]); 

  // --- ( useEffect untuk search film tidak berubah ) ---
  useEffect(() => {
    if (searchQuery === null || searchQuery.title === '' || !API_KEY) {
        setError(null);
        if (!API_KEY && searchQuery) setError("Error: API Key is missing or invalid.");
        return;
    }
    const fetchMovies = async () => {
        setLoading(true);
        setError(null);
        setMovies([]);
        let url = `${API_URL}&s=${searchQuery.title}&type=${searchQuery.type}`;
        if (searchQuery.year) url += `&y=${searchQuery.year}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.Response === 'True') {
                const filteredResults = data.Search.filter(movie => {
                    return movie.Poster && movie.Poster !== 'N/A';
                });
                if (filteredResults.length > 0) {
                    setMovies(filteredResults);
                } else {
                    setError("Hasil ditemukan, tetapi semua poster hilang atau tidak valid.");
                }
                setLoading(false);
            } else {
                setError(data.Error); 
                setLoading(false);
            }
        } catch (err) {
            setError('Gagal mengambil data. Cek koneksi internet Anda.');
            setLoading(false);
        }
    };
    fetchMovies();
  }, [searchQuery, API_URL]);

  // --- ( useEffect untuk detail film tidak berubah ) ---
  useEffect(() => {
    if (!selectedMovieId || !API_KEY) {
      return;
    }
    const fetchDetail = async () => {
      setDetailLoading(true);
      setMovieDetail(null);
      const url = `${API_URL}&i=${selectedMovieId}&plot=full`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True') {
          const { Title, Year, Plot, Poster, Genre, Director, Actors, imdbRating, imdbID, Runtime, Rated } = data;
          setMovieDetail({ Title, Year, Plot, Poster, Genre, Director, Actors, imdbRating, imdbID, Runtime, Rated });
          setDetailLoading(false);
        } else {
          console.error("Gagal ambil detail:", data.Error);
          setDetailLoading(false);
        }
      } catch (error) {
        console.error("Network error:", error);
        setDetailLoading(false);
      }
    };
    fetchDetail();
  }, [selectedMovieId, API_URL]);


  // MODIFIKASI: Cek favorit berdasarkan state 'favorites' (yang sudah spesifik per user)
  const isFavorite = movieDetail ? favorites.some(fav => fav.imdbID === movieDetail.imdbID) : false;
  const hasSearched = searchQuery !== null; 

  return (
    <main>
      <AppHeader 
        onToggleFilter={toggleAdvancedFilter}
        isFilterActive={isAdvancedFilterVisible}
        onNavFilter={handleNavFilter}
        onSearch={handleSearch}
        
        // --- PROPS LOGIN/LOGOUT DIMODIFIKASI ---
        isLoggedIn={!!currentUser} // Cek jika currentUser tidak null
        onLoginClick={openLoginModal} // Buka modal login
        onLogout={handleLogout}
      />
      
      {isAdvancedFilterVisible && (
          <div className="filter-background-wrapper">
              <div className="container"> 
                  <MovieFilter onSearch={handleSearch} isHero={false} />
              </div>
          </div>
      )}
      
      <div className="container"> 
        <SearchResult 
          movies={movies} 
          loading={loading} 
          error={error} 
          onMovieClick={handleMovieClick}
          hasSearched={hasSearched} 
          
          // --- PROPS BARU: Kirim daftar favorit ke SearchResult ---
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoggedIn={!!currentUser}
        />
      </div>
      
      {selectedMovieId && (
        <MovieModal 
          detail={movieDetail}
          loading={detailLoading}
          onClose={handleCloseMovieModal}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}

      {/* --- RENDER MODAL LOGIN & REGISTER --- */}
      <LoginModal 
        isVisible={isLoginModalVisible}
        onClose={closeAllModals}
        onLogin={handleLoginAttempt}
        onSwitchToRegister={openRegisterModal}
      />
      
      <RegisterModal 
        isVisible={isRegisterModalVisible}
        onClose={closeAllModals}
        onRegister={handleRegisterAttempt}
        onSwitchToLogin={openLoginModal}
      />
      
      <Footer nama="Nadia Anata" nim="123140060" />
    </main>
  );
}

export default App;
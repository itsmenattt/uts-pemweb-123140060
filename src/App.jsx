import { useState, useEffect, useCallback } from 'react';
import './App.css';
import AppHeader from './components/AppHeader'; 
import MovieFilter from './components/MovieFilter'; 
import SearchResult from './components/SearchResult'; 
import MovieModal from './components/MovieModal'; 
import Footer from './components/Footer'; 
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal'; 

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

const loadUsersDB = () => {
    const db = localStorage.getItem('movieAppUsers');
    return db ? JSON.parse(db) : {};
};

const saveUsersDB = (db) => {
    localStorage.setItem('movieAppUsers', JSON.stringify(db));
};


function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(true); 
  const [isShowingFavorites, setIsShowingFavorites] = useState(false); 

  const [users, setUsers] = useState(loadUsersDB()); 
  const [currentUser, setCurrentUser] = useState(null); 
  const [favorites, setFavorites] = useState([]); 
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false); 


  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser && users[loggedInUser]) {
        setCurrentUser(loggedInUser);
    }
  }, []); 

  useEffect(() => {
    if (currentUser && users[currentUser]) {
        setFavorites(users[currentUser].favorites || []);
    } else {
        setFavorites([]);
    }
  }, [users, currentUser]); 


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
      setIsShowingFavorites(false); 
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsShowingFavorites(false); 
  };
  const toggleAdvancedFilter = () => {
      setIsAdvancedFilterVisible(prev => !prev);
  };

  const handleMovieClick = (imdbID) => { setSelectedMovieId(imdbID); };
  const handleCloseMovieModal = () => {
    setSelectedMovieId(null);
    setMovieDetail(null);
  };

  const toggleFavorite = useCallback((movie) => {
    if (!currentUser) {
        alert('Anda harus login untuk menambah favorit!');
        return;
    }
    setUsers(prevUsers => {
        const oldFavorites = prevUsers[currentUser]?.favorites || [];
        const isFavorite = oldFavorites.some(fav => fav.imdbID === movie.imdbID);
        let newFavorites;
        if (isFavorite) {
            newFavorites = oldFavorites.filter(fav => fav.imdbID !== movie.imdbID);
        } else {
            newFavorites = [...oldFavorites, movie];
        }
        const updatedUser = { ...prevUsers[currentUser], favorites: newFavorites };
        const updatedUsersDB = { ...prevUsers, [currentUser]: updatedUser };
        saveUsersDB(updatedUsersDB); 
        return updatedUsersDB;
    });
  }, [currentUser]); 


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
  const handleShowFavorites = () => {
    if (!currentUser) {
        alert('Anda harus login untuk melihat favorit.');
        openLoginModal();
        return;
    }
    setIsShowingFavorites(true);
    setLoading(false);
    setError(null);
  };

  const handleGoHome = () => {
    setIsShowingFavorites(false);
    setSearchQuery(null);
    setMovies([]); 
    setLoading(true); 
    setError(null);
    setIsAdvancedFilterVisible(true); 
  };

  const handleLoginAttempt = (username, password) => {
    const user = users[username];
    if (user && user.password === password) {
        setCurrentUser(username); 
        localStorage.setItem('currentUser', username); 
        closeAllModals();
        return true; 
    }
    return false; 
  };
  const handleRegisterAttempt = (username, password) => {
    if (users[username]) {
        return false; 
    }
    const newUser = { password: password, favorites: [] };
    const updatedUsersDB = { ...users, [username]: newUser };
    setUsers(updatedUsersDB); 
    saveUsersDB(updatedUsersDB);
    setCurrentUser(username); 
    localStorage.setItem('currentUser', username);
    closeAllModals();
    return true;
  };
  const handleLogout = () => {
    setCurrentUser(null); 
    localStorage.removeItem('currentUser'); 
    setIsShowingFavorites(false); 
  };

  useEffect(() => {
      if (!API_KEY || movies.length > 0 || searchQuery !== null || isShowingFavorites) return; 
      
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
  }, [API_KEY, API_URL, searchQuery, isShowingFavorites, movies.length]); 

  useEffect(() => {
    if (searchQuery === null || searchQuery.title === '' || !API_KEY || isShowingFavorites) {
        if (isShowingFavorites) setError(null);
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
  }, [searchQuery, API_URL, isShowingFavorites]); 

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


  const isFavorite = movieDetail ? favorites.some(fav => fav.imdbID === movieDetail.imdbID) : false;
  const moviesToDisplay = isShowingFavorites ? favorites : movies;
  const hasResult = isShowingFavorites || searchQuery !== null;

  return (
    <main>
      <AppHeader 
        onToggleFilter={toggleAdvancedFilter}
        isFilterActive={isAdvancedFilterVisible}
        onNavFilter={handleNavFilter}
        onSearch={handleSearch}
        isLoggedIn={!!currentUser} 
        onLoginClick={openLoginModal} 
        onLogout={handleLogout}
        onShowFavorites={handleShowFavorites}
        onGoHome={handleGoHome} 
      />
      
      {}

      {isAdvancedFilterVisible && (
          <div className="filter-background-wrapper">
              <div className="container"> 
                  <MovieFilter onSearch={handleSearch} isHero={false} />
              </div>
          </div>
      )}
      
      <div className="container"> 
        <SearchResult 
          movies={moviesToDisplay} 
          loading={loading} 
          error={error} 
          onMovieClick={handleMovieClick}
          hasSearched={hasResult} 
          isShowingFavorites={isShowingFavorites} 
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
      
      <Footer nama="Nadia Anatashiva" nim="123140060" />
    </main>
  );
}

export default App;
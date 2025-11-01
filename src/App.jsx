import { useState, useEffect, useCallback } from 'react';
import './App.css';
import AppHeader from './components/AppHeader'; 
import MovieFilter from './components/MovieFilter'; 
import SearchResult from './components/SearchResult'; 
import MovieModal from './components/MovieModal'; 
import Footer from './components/Footer'; 

// Hapus import komponen LoginModal dan HeroOverlay
// Hapus REGISTERED_USERS

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

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [movieDetail, setMovieDetail] = useState(null);
  const [isAdvancedFilterVisible, setIsAdvancedFilterVisible] = useState(true); 

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('movieFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Perbaikan Keyword Navigasi: Gunakan keyword yang lebih umum
  const handleNavFilter = (navType) => {
      let query = { title: 'popular', year: '', type: 'movie' }; 

      switch (navType) {
          case 'movie':
              query = { title: 'action', year: '', type: 'movie' }; 
              break;
          case 'series':
              query = { title: 'drama', year: '', type: 'series' }; 
              break;
          case 'more':
              query = { title: 'comedy', year: '', type: 'movie' }; 
              break;
          default:
              break;
      }

      setSearchQuery(query);
      setIsAdvancedFilterVisible(false); 
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleMovieClick = (imdbID) => {
    setSelectedMovieId(imdbID);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
    setMovieDetail(null);
  };

  const toggleAdvancedFilter = () => {
      setIsAdvancedFilterVisible(prev => !prev);
  };

  const toggleFavorite = useCallback((movie) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.some(fav => fav.imdbID === movie.imdbID);
      let newFavorites;

      if (isFavorite) {
        newFavorites = prevFavorites.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        newFavorites = [...prevFavorites, movie];
      }
      localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []); 

  // LOGIC MEMUAT FILM AWAL (Hanya perbaikan dependensi)
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

  // LOGIC SEARCH FILM (PERBAIKAN KRITIS: FILTER POSTER)
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
                
                // FILTER KRITIS: Buang film dengan poster 'N/A' atau hilang
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
                setError(data.Error); // Tampilkan error dari API (e.g., "Series not found!")
                setLoading(false);
            }
        } catch (err) {
            setError('Gagal mengambil data. Cek koneksi internet Anda.');
            setLoading(false);
        }
    };

    fetchMovies();
  }, [searchQuery, API_URL]);

  // LOGIC DETAIL FILM (TIDAK BERUBAH)
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
  const hasSearched = searchQuery !== null; 

  return (
    <main>
      <AppHeader 
        onToggleFilter={toggleAdvancedFilter}
        isFilterActive={isAdvancedFilterVisible}
        onNavFilter={handleNavFilter}
        onSearch={handleSearch}
        // Hapus props login
      />
      
      {/* FULL-WIDTH BACKGROUND FILTER */}
      {isAdvancedFilterVisible && (
          <div className="filter-background-wrapper">
              <div className="container"> 
                  <MovieFilter onSearch={handleSearch} isHero={false} />
              </div>
          </div>
      )}
      
      {/* Container utama untuk hasil pencarian */}
      <div className="container"> 
        <SearchResult 
          movies={movies} 
          loading={loading} 
          error={error} 
          onMovieClick={handleMovieClick}
          hasSearched={hasSearched} 
        />
      </div>
      
      {selectedMovieId && (
        <MovieModal 
          detail={movieDetail}
          loading={detailLoading}
          onClose={handleCloseModal}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      )}
      
      {/* Footer Component */}
      <Footer nama="Nadia Anata" nim="123140060" />

    </main>
  );
}

export default App;
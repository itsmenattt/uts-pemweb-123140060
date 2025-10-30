import { useState, useEffect, useCallback } from 'react';
import './App.css';
import AppHeader from './components/AppHeader'; 
import MovieFilter from './components/MovieFilter'; 
import SearchResult from './components/SearchResult'; 
import MovieModal from './components/MovieModal'; 

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

  useEffect(() => {
      if (!API_KEY || movies.length > 0 || searchQuery !== null) return; 
  
      const fetchInitialMovies = async () => {
          setLoading(true);
          setError(null);
          const initialUrl = `${API_URL}&s=top&page=1`; 
          
          try {
              const response = await fetch(initialUrl);
              const data = await response.json();
              
              if (data.Response === 'True') {
                  const filteredResults = data.Search.filter(movie => {
                      const hasPoster = movie.Poster && movie.Poster !== 'N/A';
                      
                      const releaseYear = parseInt(movie.Year);
                      const isRecent = !isNaN(releaseYear) && releaseYear >= 2000;

                      return hasPoster && isRecent;
                  });

                  const shuffledResults = shuffleArray(filteredResults);
                  
                  setMovies(shuffledResults.slice(0, 8)); 

              } else {
                  setError("Error: " + data.Error); 
              }
          } catch (error) {
              setError('Gagal memuat film awal.');
          } finally {
              setLoading(false);
          }
      };
      
      fetchInitialMovies();
      
  }, [API_KEY, API_URL, movies.length, searchQuery]);


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
                setMovies(data.Search);
            } else {
                setError(data.Error);
            }
        } catch (err) {
            setError('Gagal mengambil data. Cek koneksi internet Anda.');
        } finally {
            setLoading(false);
        }
    };

    fetchMovies();
  }, [searchQuery, API_URL]);


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
          const { Title, Year, Plot, Poster, Genre, Director, Actors, imdbRating, imdbID } = data;
          setMovieDetail({ Title, Year, Plot, Poster, Genre, Director, Actors, imdbRating, imdbID });
        } else {
          console.error("Gagal ambil detail:", data.Error);
        }
      } catch (error) {
        console.error("Network error:", error);
      } finally {
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
      />
      
      <div className="container">
        {isAdvancedFilterVisible && (
            <MovieFilter onSearch={handleSearch} isHero={false} />
        )}

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
    </main>
  );
}

export default App;
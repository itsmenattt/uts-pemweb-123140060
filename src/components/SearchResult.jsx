import './SearchResult.css';

const PLACEHOLDER_URL = 'https://via.placeholder.com/185x278?text=Poster+Missing';

function SearchResult({ 
  movies, 
  loading, 
  error, 
  onMovieClick, 
  hasSearched, 
  isShowingFavorites,
  isLoggedIn, 
  favorites, 
  onToggleFavorite 
}) { 
  
  if (loading) {
    return <div className="loading-msg">Mencari film... 🎬</div>;
  }

  if (error) {
    return <div className="error-msg">Error: {error} 😞</div>;
  }
  if (movies === null || movies.length === 0) {
    if (isShowingFavorites) {
        return <div className="initial-msg">Anda belum memiliki film favorit. ☆</div>;
    }
    if (!hasSearched) {
        return null; 
    }
    return null;
  }

  const headingText = isShowingFavorites 
    ? "Favorit Saya" 
    : (hasSearched ? "Hasil Pencarian" : "Rekomendasi Film");

  return (
    <section className="search-result">
      <h3 className="result-heading">{headingText}</h3>
      
      <div className="movie-grid">
        {movies.map((movie) => {
          
          const isFav = favorites.some(fav => fav.imdbID === movie.imdbID);

          const handleFavClick = (e) => {
            e.stopPropagation(); 
            onToggleFavorite(movie);
          };

          return (
            <div 
              key={movie.imdbID} 
              className="movie-card"
              onClick={() => onMovieClick(movie.imdbID)} 
            >
              
              {isLoggedIn && (
                <button 
                  className={`fav-btn ${isFav ? 'active' : ''}`}
                  onClick={handleFavClick}
                  title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                >
                  {isFav ? '⭐' : '☆'}
                </button>
              )}

              <img 
                src={
                  movie.Poster && movie.Poster !== 'N/A' && movie.Poster.startsWith('http')
                  ? movie.Poster 
                  : PLACEHOLDER_URL
                } 
                alt={`Poster ${movie.Title}`} 
                className="card-poster"
              />
              
              <div className="card-info">
                <h4>{movie.Title}</h4>
                <p>{movie.Year}</p>
              </div>
              
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SearchResult;
import './SearchResult.css';

const PLACEHOLDER_URL = 'https://via.placeholder.com/185x278?text=Poster+Missing';

function SearchResult({ movies, loading, error, onMovieClick, hasSearched }) { 
  
  if (loading) {
    return <div className="loading-msg">Mencari film... 🎬</div>;
  }

  if (error) {
    return <div className="error-msg">Error: {error} 😞</div>;
  }

  if (movies === null || movies.length === 0) {
    return null; 
  }

  return (
    <section className="search-result">
  <h3 className="result-heading">{hasSearched ? "Hasil Pencarian" : "Rekomendasi Film"}</h3>
      
      <div className="movie-grid">
        {movies.map((movie) => (
          <div 
            key={movie.imdbID} 
            className="movie-card"
            onClick={() => onMovieClick(movie.imdbID)} 
          >
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
        ))}
      </div>
    </section>
  );
}

export default SearchResult;
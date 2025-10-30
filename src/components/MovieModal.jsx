import './MovieModal.css';

function MovieModal({ detail, loading, onClose, onToggleFavorite, isFavorite }) {
  if (!detail && !loading) return null; 

  const handleFavoriteClick = () => {
    onToggleFavorite(detail);
  };

  let content;
  if (loading) {
    content = <div>Memuat detail... 🎬</div>;
  } else if (detail) {
    const { Title, Year, Plot, Poster, Genre, Director, Actors, imdbRating } = detail;
    
    const favButtonText = isFavorite ? '⭐ Hapus dari Favorit' : '☆ Tambah ke Favorit';
    const favButtonClass = isFavorite ? 'btn-favorite is-favorite' : 'btn-favorite';

    content = (
      <div className="modal-content-inner">
        <div className="detail-header">
            <h2>{Title} ({Year})</h2>
            <button className={favButtonClass} onClick={handleFavoriteClick}>
                {favButtonText}
            </button>
        </div>
        
        <div className="detail-body">
            <img 
                src={Poster === 'N/A' ? 'https://via.placeholder.com/200x300?text=No+Image' : Poster} 
                alt={`Poster ${Title}`} 
                className="detail-poster"
            />
            <div className="detail-info">
                <table>
                    <tbody>
                        <tr><th>Rating IMDB</th><td>{imdbRating} ⭐</td></tr>
                        <tr><th>Genre</th><td>{Genre}</td></tr>
                        <tr><th>Director</th><td>{Director}</td></tr>
                        <tr><th>Aktor</th><td>{Actors}</td></tr>
                    </tbody>
                </table>
                <p><strong>Sinopsis:</strong> {Plot}</p>
            </div>
        </div>

      </div>
    );
  } else {
      content = <div>Detail film tidak ditemukan.</div>
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {}
      <div className="modal-main" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        {content}
      </div>
    </div>
  );
}

export default MovieModal;
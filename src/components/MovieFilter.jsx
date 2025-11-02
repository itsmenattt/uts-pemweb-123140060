import { useState } from 'react';
import './MovieFilter.css';

function MovieFilter({ onSearch, isHero = false }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('movie');
  const [minRating, setMinRating] = useState(5); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === '') return; 

    onSearch({ title, year, type, minRating }); 
  };

  return (
    <section className="movie-filter filter-card-container">
      <h2>Filter Pencarian</h2>
      <form onSubmit={handleSubmit} className="advanced-filter-form filter-grid">
        
        <div className="form-group">
          <label htmlFor="title">Judul Film:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Batman"
            required 
          />
        </div>

        <div className="form-group">
          <label htmlFor="year">Tahun Rilis:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Contoh: 2008"
            min="1900"
            max="2025" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Tipe:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="movie">Movie</option>
            <option value="series">Series</option>
            <option value="episode">Episode</option>
          </select>
        </div>

        <div className="form-group range-group">
          <label htmlFor="rating">Min. Rating: {minRating}</label>
          <input
            type="range"
            id="rating"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            min="1"
            max="10"
          />
        </div>

        <button type="submit" className="btn-search filter-submit-btn">Cari</button>
      </form>
    </section>
  );
}

export default MovieFilter;
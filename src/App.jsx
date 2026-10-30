import { useState, useEffect } from 'react';
import { isCancel } from 'axios';
import { getPopularMovies, searchMovies } from './api/tmdb';
import MovieCard from './components/MovieCard'

export default function App() {

  const[movies, setMovies] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);
  const[query, setQuery] = useState("");
  const[search, setSearch] = useState("");
  const[selectedMovie, setSelectedMovie] = useState(null);
  const[page, setPage] = useState(1);
 
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

      const request = search
        ? searchMovies(search, page, controller.signal)
        : getPopularMovies(page, controller.signal);
      
      request
        .then((data) => { setMovies((prev) => (page === 1 ? data : [...prev, ...data])); 
                          setLoading(false); })
        .catch((err) => {
          if (isCancel(err)) return;
          setError("Couldn't load movies. Try again later.");
          setLoading(false);
        });

      return() => controller.abort();
  }, [search, page]);

  return (
    <main className="app">
      <h1>Movie Explorer</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        setSearch(query.trim());
        setPage(1);
      }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {/* Show an empty state */}
      {!loading && !error && (
        <>
          {movies.length > 0 ? (
            <div className='grid'>
              {movies.map((m) => (
              <MovieCard key={movies.id} movie={m} onSelect={() => setSelectedMovie(m)}/>
            ))}
            </div>
          ) : search ? (
            <p className='empty'>No results for &ldquo;{search}&rdquo;</p>
          ) :null}

          {/* Load more */}
          {movies.length > 0 && !loading && (
            <div style={{ textAlign: "center", margin: "2rem 0"}}>
              <button onClick={() => setPage((p) => p + 1)}>Load More</button>
            </div>
          )}
        </>
        
      )}

      {/* Movie details */}
      {selectedMovie && (
        <div className='modal-backdrop' onClick={() => setSelectedMovie(null)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>
            <button onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}

    </main>
  )
}
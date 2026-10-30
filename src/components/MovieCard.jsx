const IMG_BASE = "https://image.tmdb.org/t/p/w342";
export default function MovieCard({ movie, onSelect }) {
    return (
        <article className="card" onClick={onSelect}>
            {movie.poster_path ? (
                <img src={`${IMG_BASE}${movie.poster_path}`} /> 
            ) : <div className='no-poster'>No image found</div>
        }
        <h3>{movie.title}</h3>
        <p>
            {movie.release_date?.slice(0,4)} *
            {movie.vote_average.toFixed(1)}
        </p>
        </article>
    )
}
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';

const MovieList = React.memo(() => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);

  const retryFetchMovies = useCallback(() => {
    setRetrying(true);
    setRetryTimer(setInterval(fetchMovies, 5000));
  }, []);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    setButtonClicked(false);

    axios
      .get('https://swapi.dev/api/films')
      .then(response => {
        setMovies(response.data.results);
        setLoading(false);
        setRetrying(false);
        clearInterval(retryTimer);
      })
      .catch(error => {
        console.log(error);
        retryFetchMovies();
      });
  }, [retryFetchMovies, retryTimer]);

  const cancelRetry = useCallback(() => {
    setRetrying(false);
    clearInterval(retryTimer);
    setLoading(false);
  }, [retryTimer]);

  const showMoviesHandler = useCallback(() => {
    setButtonClicked(true);
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (movies.length > 0) {
      setLoading(false);
    }
  }, [movies]);

  return (
    <div>
      <h2>Star Wars Movies</h2>
      <button onClick={showMoviesHandler}>Fetch Movies</button>
      {retrying && !buttonClicked && <p>Retrying...</p>}
      {loading && !buttonClicked ? (
        <p>Loading...</p>
      ) : (
        <Card.Group>
          {movies.map(movie => (
            <Card key={movie.episode_id}>
              <Card.Content>
                <Card.Header>{movie.title}</Card.Header>
                <Card.Meta>Episode {movie.episode_id}</Card.Meta>
                <Card.Description>{movie.opening_crawl}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )}
      {retrying && (
        <button onClick={cancelRetry}>Cancel Retry</button>
      )}
    </div>
  );
});

export default MovieList;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    setLoading(true);
    setButtonClicked(false);

    axios
      .get('https://swapi.dev/api/film')
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
  };

  const retryFetchMovies = () => {
    setRetrying(true);
    setRetryTimer(setInterval(fetchMovies, 5000));
  };

  const cancelRetry = () => {
    setRetrying(false);
    clearInterval(retryTimer);
    setLoading(false);
  };

  const showMoviesHandler = () => {
    setButtonClicked(true);
    fetchMovies();
  };

  return (
    <div>
      <h2>Star Wars Movies</h2>
      <button onClick={showMoviesHandler}>Fetch Movies</button>
      {/* {(!loading && buttonClicked) && <p>Loading...</p>} */}
      {retrying && !buttonClicked && <p>Retrying...</p>}
      {loading && !buttonClicked? (
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
};

export default MovieList;

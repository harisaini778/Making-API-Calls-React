import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://swapi.dev/api/films')
      .then(response => {
        setMovies(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const showMoviesHandler = () => {
    setLoading(!loading);
  };

  return (
    <div>
      <h2>Star Wars Movies</h2>
      <button onClick={showMoviesHandler}>Fetch Movies</button>
      {loading ? (
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
      ) : null}
    </div>
  );
};

export default MovieList;

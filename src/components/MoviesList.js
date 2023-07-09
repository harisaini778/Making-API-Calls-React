import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';

const MovieList = React.memo(() => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryTimer, setRetryTimer] = useState(null);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieEpisode, setNewMovieEpisode] = useState('');
  const [newMovieOpeningCrawl, setNewMovieOpeningCrawl] = useState('');

  const retryFetchMovies = useCallback(() => {
    setRetrying(true);
    setRetryTimer(setInterval(fetchMovies, 5000));
  }, []);

  const fetchMovies = useCallback(() => {
    setLoading(true);
    setButtonClicked(false);

    axios
      .get('https://crudcrud.com/Dashboard/226a7ef6d942401a8fe548015b3086ce') 
      .then(response => {
        setMovies(response.data);
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

  const handleTitleChange = useCallback(event => {
    setNewMovieTitle(event.target.value);
  }, []);

  const handleEpisodeChange = useCallback(event => {
    setNewMovieEpisode(event.target.value);
  }, []);

  const handleOpeningCrawlChange = useCallback(event => {
    setNewMovieOpeningCrawl(event.target.value);
  }, []);

  const handleAddMovie = useCallback(() => {
    const newMovieObj = {
      title: newMovieTitle,
      episode_id: newMovieEpisode,
      opening_crawl: newMovieOpeningCrawl
    };

    axios
      .post('https://crudcrud.com/Dashboard/226a7ef6d942401a8fe548015b3086ce', newMovieObj) // Replace with your dummy API endpoint for creating a new movie
      .then(response => {
        setMovies(prevMovies => [...prevMovies, response.data]);
      })
      .catch(error => {
        console.log(error);
      });

    setNewMovieTitle('');
    setNewMovieEpisode('');
    setNewMovieOpeningCrawl('');
  }, [newMovieTitle, newMovieEpisode, newMovieOpeningCrawl]);

  const handleDeleteMovie = useCallback(id => {
    axios
      .delete(`https://crudcrud.com/Dashboard/226a7ef6d942401a8fe548015b3086ce/${id}`) // Replace with your dummy API endpoint for deleting a movie
      .then(() => {
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

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
      <div className="add-movie-form">
        <input
          type="text"
          placeholder="Title"
          value={newMovieTitle}
          onChange={handleTitleChange}
        />
        <input
          type="number"
          placeholder="Episode"
          value={newMovieEpisode}
          onChange={handleEpisodeChange}
        />
        <textarea
          placeholder="Opening Crawl"
          value={newMovieOpeningCrawl}
          onChange={handleOpeningCrawlChange}
        ></textarea>
        <button onClick={handleAddMovie}>Add Movie</button>
      </div>
      <button onClick={showMoviesHandler}>Fetch Movies</button>
      {retrying && !buttonClicked && <p>Retrying...</p>}
      {loading && !buttonClicked ? (
        <p>Loading...</p>
      ) : (
        <Card.Group>
          {movies.map(movie => (
            <Card key={movie.id}>
              <Card.Content>
                <Card.Header>{movie.title}</Card.Header>
                <Card.Meta>Episode {movie.episode_id}</Card.Meta>
                <Card.Description>{movie.opening_crawl}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
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

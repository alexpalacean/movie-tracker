import React from 'react';
import {
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  SimpleGrid,
  Badge,
  Tooltip,
  Button
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import useFetchEffect from '../hooks/useFetchEffect';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { WATCHLIST_URL } from '../connectors/api';
import { STATUS } from '../utils';
import WatchlistButton from '../components/WatchlistButton';
import { useState, useEffect } from 'react';
import useMovie from '../hooks/useMovie';
import { useParams } from 'react-router-dom';
export default function Watchlist() {
  const { movieId } = useParams();
  const {  data: genres } = useFetchEffect('https://api.themoviedb.org/3/genre/movie/list?api_key=d4a8045464e5c17496ef776ab07cea1a&language=en-US')

  const { status, data: movies, error } = useFetchEffect(`${WATCHLIST_URL}`);

  const { movie, status_movie, error_movie, updateStatus, updateMovie } = useMovie(movieId);
  const gen = []
  gen.push(genres)

  if (status === STATUS.IDLE) {
    return null;
  }
  if (status === STATUS.PENDING) {
    return (
      <Center minH="50vh">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }
  if (status === STATUS.REJECTED) {
    return (
      <Container p={3}>
        <Text>Error fetching watchlist: {JSON.stringify(error)}</Text>
      </Container>
    );
  }

 
  const random = Math.floor(Math.random() * Math.floor(3),);
  let randomItems = movies.sort(() => .5 - Math.random()).slice(0, 3);


  // fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=d4a8045464e5c17496ef776ab07cea1a&language=en-US')
  // .then(data => data.json())
  // .then(content => {
  //   content.genres.map(el=>genres.push(el.name))
  // })

  return (
    <Container p={3} maxW="80em">
      <Box>
      {gen[0].genres.map(el=>(
      <Button  m={1}>{el.name}</Button>
      ))}
      </Box>
      <SimpleGrid minChildWidth={150} spacing={3}>
        {randomItems.map(movie => (
          <Box key={movie.id} pos="relative" noOfLines={2}>
            <Badge  colorScheme="cyan" pos="absolute" top={1} >
            <WatchlistButton  zIndex={5} movie={movie} status={updateStatus} update={updateMovie}></WatchlistButton>
            </Badge>
            <Tooltip label={movie.title}>
              <Image
                src={buildImageUrl(movie.poster_path, 'w300')}
                alt="Poster"
                fallbackSrc={imageFallback}
              />
            </Tooltip>
            <Text textAlign="center" as={Link} to={`/movies/${movie.id}`}>{movie.title}</Text>
          </Box>
        ))}
         <Button mb={2} onClick={() => window.location.reload(false)}> Refresh</Button>
      </SimpleGrid>
    </Container>
  );
}

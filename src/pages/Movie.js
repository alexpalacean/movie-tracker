import React from 'react';
import {
  Text,
  Image,
  CircularProgress,
  Center,
  Container,
  Box,
  HStack,
  Heading,
  IconButton,
  Flex,
  Square,
  Divider,
  Button
} from '@chakra-ui/react';
import { ChevronLeftIcon, AddIcon, CheckIcon } from '@chakra-ui/icons';
import { useParams, useHistory } from 'react-router-dom';
import useMovie from '../hooks/useMovie';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { getYear, STATUS } from '../utils';
import WatchlistButton from '../components/WatchlistButton';
import HistoryButton from '../components/HistoryButton';

export default function Movie() {
  const { movieId } = useParams();
  const history = useHistory();
  const [isHistoryActive, setHistoryActive] = React.useState(false); // temp state, for UI only, should be removed when implemented properly

  const { movie, status, error, updateStatus, updateMovie } = useMovie(movieId);
  console.log(movie)
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
        <Text>
          Error fetching movie with ID {movieId}: {JSON.stringify(error)}
        </Text>
      </Container>
    );
  }

  return (
    <Container p={3} maxW="80em">
      <HStack mb={3} justify="space-between">
        <IconButton
          aria-label="Back"
          icon={<ChevronLeftIcon />}
          variant="outline"
          fontSize={36}
          colorScheme="teal"
          onClick={history.goBack}
        />
          <Text letterSpacing={2} as="span" color="gray.100" opacity={0.5}>{movie.tagline} </Text>
        <HStack>
          <WatchlistButton movie={movie} status={updateStatus} update={updateMovie} />
          <HistoryButton movie={movie} status={updateStatus} update={updateMovie} ></HistoryButton>
        </HStack>
      </HStack>
     <Container maxW="60em" >
     <HStack maxW="50em" >
      </HStack>
       <Flex justify="space-between">
       <Flex alignItems="center">
         <Box transform="rotate(-90deg)" >
         <Text fontSize="4xl" as="span" opacity={0.5}>{getYear(movie.release_date)}</Text>
         </Box>
        </Flex>
       <Box>
       <Image
            src={buildImageUrl(movie.poster_path, 'w300')}
            alt="Poster"
            w="35vw"
            maxW={300}
            fallbackSrc={imageFallback}
          />
       </Box>
        <Box ml={5}>
          <Heading as="h1" size="2xl">{movie.title}</Heading>
        <Box>
          <HStack justify="center">
          <Text  as="span" color="gray.800">
                {movie.tagline}
          </Text>
          </HStack>
          <Text textAlign="center" color="gray.200">Runtime: {movie.runtime} minutes</Text>
        <Divider mt={1} orientation="horizontal" />
          <Flex mt={2} justify="center">
            {movie.genres.map(({id, name})=>(
              <Text pl={5} color="GrayText" key={id}>{name}</Text>
            ))}
          </Flex>
        <Divider mt={2} orientation="horizontal" />
        <Text color="cyan.100">Vote average: {movie.vote_average}</Text>
        <Text mt={2} color="gray.200">{movie.overview}</Text>
           
        </Box>
        </Box>
        </Flex>
     </Container>
    </Container>
  );
}

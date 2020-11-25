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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/react";
import { WATCHLIST_URL } from '../connectors/api';
import useFetchEffect from '../hooks/useFetchEffect';
import { STATUS } from '../utils';
import { buildImageUrl, imageFallback } from '../connectors/tmdb';
import { Link } from 'react-router-dom';

export default function Home() {

  function VerticallyCenter() {
    const { status, data: movies, error } = useFetchEffect(`${WATCHLIST_URL}`);
   
    const { isOpen, onOpen, onClose } = useDisclosure()
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
     
    const random = Math.floor(Math.random() * Math.floor(1));
    let randomItems = movies.sort(() => .5 - Math.random()).slice(0, 1);

    const ar = movies.map(el=> el.time)
    console.log(ar.sort((a, b) => (a > b ? -1 : 1)))
   
    return (
      <>
        <Button  pl={2} onClick={onOpen}>Click here to see what to watch first</Button>
          <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> { randomItems.map(movie=> movie.title)}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <strong>{ randomItems.map(movie=> movie.runtime)} minutes</strong>
            <p> { randomItems.map(movie=> movie.overview)}</p>
            <p> Popularity: { randomItems.map(movie=> movie.popularity)}</p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Container p={3} maxW="80em">
        <SimpleGrid minChildWidth={150} spacing={3}>
          {randomItems.map(movie => (
            <Box key={movie.id} pos="relative" noOfLines={2}>
              <Flex justify="space-between">
            {movies.sort(() => .5 - Math.random()).slice(0, 3).map(movie=>(
            <Box as={Link} to={`/movies/${movie.id}`} key={movie.id}>
              <Image
                src={buildImageUrl(movie.poster_path, 'w300')}
                alt="Poster"
                w="35vw"
                maxW={300}
                fallbackSrc={imageFallback}
              />
              </Box>
              ))}
                </Flex>
              </Box>
                ))}
              </SimpleGrid>
        </Container>
      </>
    )
  }
  return (
    <Container maxW="80em" m="auto">
    <Text pl={2} fontSize="5xl" mt={3}>
      Hello, and welcome back!
    </Text>
    <Box pl={2}>
    {  VerticallyCenter()}
    </Box>
    </Container>
  );
}

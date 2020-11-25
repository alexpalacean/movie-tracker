import React from 'react';
import { useParams, useHistory, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Input,
  IconButton,
  UnorderedList,
  ListItem,
  Container,
  Link,
  Progress,
  Text,
  Button,
  ButtonGroup,
  Tooltip
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import useFetchEffect from '../hooks/useFetchEffect';
import { buildSearchMovieUrl } from '../connectors/tmdb';
import { getYear, STATUS } from '../utils';

export default function Search() {
  const { terms } = useParams();
  const history = useHistory();
  const searchRef = React.useRef(null);

  const handleSearch = event => {
    event.preventDefault();
    const value = searchRef.current.value;
    if (value !== terms) {
      history.push(`/search/${value}`);
    }
  };

  const { status, data, error } = useFetchEffect(buildSearchMovieUrl(terms), !!terms);

  return (
    <Container maxW="50em" p={3}>
      <Box as="form" onSubmit={handleSearch} w="100%" d="flex" mb={3}>
        <Input placeholder="Search for a movie..." defaultValue={terms} ref={searchRef} mr={3} />
        <IconButton
          aria-label="Search for a movie"
          icon={<SearchIcon />}
          type="submit"
          isLoading={status === STATUS.PENDING}
        />
      </Box>
      {status === STATUS.IDLE && <Text>Type some terms and submit for a quick search</Text>}
      {status === STATUS.PENDING && <Progress size="xs" isIndeterminate />}
      {status === STATUS.REJECTED && (
        <Text>
          Error fetching movies for {terms}: {JSON.stringify(error)}
        </Text>
      )}
      {status === STATUS.RESOLVED && (
        <Box>
          {data.results.map(({id, title,
           name, release_date, popularity, vote_average}) => (
            <Tooltip hasArrow label={"Rating: " + vote_average + "/" + "Year: " + getYear(release_date)} aria-label="A tooltip"> 
            <ButtonGroup  p={1} variant="outline" spacing="6" key={id}>
              <Button key={id} as={RouterLink} to={`/movies/${id}`}>
                {title || name}
              </Button>  
            </ButtonGroup>
            </Tooltip>
          ))}   
        </Box>
      )}
    </Container>
  );
}

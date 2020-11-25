import React from 'react';
import { IconButton, Tooltip } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { STATUS } from '../utils';
import { HISTORY } from '../connectors/api';

export default function HistoryButton({ movie, status, update }) {
  const toggleHistory = () => {
    update({
      ...movie,
      history: movie.history === HISTORY.LISTED ? HISTORY.REMOVED : HISTORY.LISTED,
    });
  };

  const isListed = movie.history === HISTORY.LISTED; // we don't care if watchlist is REMOVED or undefined, both means it's not listed
  const label = isListed ? 'Add to history' : 'Remove from history';
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={label}
        icon={<StarIcon />}
        colorScheme="teal"
        variant={isListed ? 'outline' : 'solid'}
        isLoading={status === STATUS.PENDING}
        onClick={toggleHistory}
      />
    </Tooltip>
  );
}

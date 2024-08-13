import { memo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box, Divider, Text } from '@chakra-ui/react';
import { IEpisode } from '@src/types/data-contracts';

import styles from './Episode.module.css';

export const Episode = memo(({ episode }: { episode: IEpisode }) => {
  const [ref, inView] = useInView();

  const setRef = useCallback(
    (node: HTMLDivElement) => {
      ref(node);
    },
    [ref]
  );

  return (
    <div ref={setRef} className={styles['episode-wrapper']}>
      {inView && (
        <Box bg="gray.100" p={5} h="89px">
          <Text fontWeight={100}>{episode.episode}</Text>
          <Divider />
          {episode.name}
        </Box>
      )}
    </div>
  );
});

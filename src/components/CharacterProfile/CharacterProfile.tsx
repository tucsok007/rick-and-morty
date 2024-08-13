import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  QueryFunctionContext,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ProfileImage } from '../ProfileImage/ProfileImage';
import { Episode } from './Episode/Episode';
import api from '@src/services/rest-api';
import { ICharacter, IEpisode } from '@src/types/data-contracts';

import styles from './CharacterProfile.module.css';
import { API_ERROR } from '@src/types/constants';

type CharacterProfileParams = {
  id: string;
};

type CharacterQueryKey = [string, { id: string }];

function getCharacter(context: QueryFunctionContext) {
  const { id } = (context.queryKey as CharacterQueryKey)[1];

  return api.get<ICharacter>(`/character/${id}`).then(({ data }) => data);
}

type EpisodeQueryKey = [string, { idArray: string[] }];

function getEpisodes(context: QueryFunctionContext) {
  const { idArray } = (context.queryKey as EpisodeQueryKey)[1];

  return api.get<IEpisode[] | IEpisode>(`/episode/${idArray.join(',')}`);
}

export const CharacterProfile = (): JSX.Element => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<CharacterProfileParams>();

  const [episodes, setEpisodes] = useState<IEpisode[] | null>(null);

  const { data, status } = useQuery({
    queryKey: ['character', { id }],
    queryFn: getCharacter,
  });

  useEffect(() => {
    queryClient
      .fetchQuery({
        queryKey: [
          'episodes',
          {
            idArray: data?.episode.map((episodeUrl) =>
              episodeUrl.split('/').pop()
            ),
          },
        ],
        queryFn: getEpisodes,
      })
      .then(({ data }) => setEpisodes(Array.isArray(data) ? data : [data]));
  }, [data]);

  const handleBack = () => {
    if ((window.history?.length || 0) > 1 || window.history.state?.idx) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (status === 'error') throw API_ERROR;

  if (status === 'pending' || episodes === null) return <Spinner />;

  return (
    <>
      <Button
        leftIcon={<ArrowBackIcon />}
        onClick={handleBack}
        aria-label="Go Back"
        colorScheme="blackAlpha"
        size="sm"
        className={styles['back-button']}
      >
        Back
      </Button>
      <VStack m={20}>
        <Flex>
          <ProfileImage data={data!} size={200} />
          <Grid
            bg="gray.100"
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(3, max-content)"
            columnGap={10}
            pl={6}
            pr={6}
            alignItems="center"
          >
            <GridItem rowSpan={1} colSpan={1}>
              <Heading size="sm">{data?.name}</Heading>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              <Badge
                colorScheme={
                  data?.status === 'Alive'
                    ? 'green'
                    : data?.status === 'Dead'
                    ? 'red'
                    : 'purple'
                }
              >
                {data?.status}
              </Badge>
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              Origin: {data?.origin.name}
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              Species: {data?.species}
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              Gender: {data?.gender}
            </GridItem>
            <GridItem rowSpan={1} colSpan={1}>
              Location: {data?.location.name}
            </GridItem>
          </Grid>
        </Flex>
        <VStack align="stretch" w="100%">
          <Box bg="gray.700" p={5} color="white">
            <Heading size="sm">Appeared in:</Heading>
          </Box>
          {episodes.map((episode) => (
            <Episode episode={episode} />
          ))}
        </VStack>
      </VStack>
    </>
  );
};

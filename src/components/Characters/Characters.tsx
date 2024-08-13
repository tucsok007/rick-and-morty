import { useEffect, useMemo, useState } from 'react';
import { QueryFunctionContext, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { ProfileImage } from '../ProfileImage/ProfileImage';
import { PaginationControl } from './PaginationControl/PaginationControl';
import api from '@src/services/rest-api';
import { ICharacterEndpointData, ICharacter } from '@src/types/data-contracts';
import { API_ERROR, PAGE_PARAM, SEARCH_PARAM } from '@src/types/constants';
import { IColumnDefinition, QueryStatus } from '@src/types/types';

type CharactersQueryKey = [string, { page: number; search: string }];

function getCharacters(context: QueryFunctionContext) {
  const { page, search } = (context.queryKey as CharactersQueryKey)[1];

  return api
    .get<ICharacterEndpointData>(
      `/character?page=${page}${search ? '&name=' + search : ''}`
    )
    .then(({ data }) => data);
}

export const Characters = (): JSX.Element => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<QueryStatus>('loading');
  const [data, setData] = useState<ICharacterEndpointData | null>(null);
  const [searchValue, setSearchValue] = useState(
    searchParams.get(SEARCH_PARAM) || ''
  );

  const currentPage = useMemo(() => {
    return +searchParams.get(PAGE_PARAM)!;
  }, [location.search]);

  const columnDefinitions: IColumnDefinition<ICharacter>[] = [
    {
      field: 'image',
      displayName: 'Avatar',
      renderer: (data) => <ProfileImage data={data!} />,
    },
    {
      field: 'name',
      displayName: 'Name',
      renderer: (data) => {
        return <Link to={`/character/${data.id}`}>{data.name}</Link>;
      },
    },
    {
      field: 'species',
      displayName: 'Species',
    },
    {
      field: 'status',
      displayName: 'Status',
    },
  ];

  useEffect(() => {
    if (!currentPage) {
      setCurrentPage(1);
      return;
    }

    setStatus('loading');

    queryClient
      .fetchQuery({
        queryKey: [
          'characters',
          {
            page: currentPage,
            search: searchParams.get(SEARCH_PARAM),
          },
        ],
        queryFn: getCharacters,
      })
      .then((data) => {
        setData(data);
        setStatus('successful');
      })
      .catch(() => setStatus('error'));
  }, [location.search]);

  const setCurrentPage = (newPage: number) => {
    const search = searchParams.get(SEARCH_PARAM);

    setSearchParams(
      search
        ? {
            [SEARCH_PARAM]: search,
            [PAGE_PARAM]: `${newPage}`,
          }
        : { [PAGE_PARAM]: `${newPage}` }
    );
  };

  const handleSearch = () => {
    setSearchParams({ [SEARCH_PARAM]: searchValue, [PAGE_PARAM]: '1' });
  };

  if (status === 'error') throw API_ERROR;

  if (status === 'loading') return <Spinner />;

  return (
    <>
      <TableContainer>
        <InputGroup marginTop={4} marginBottom={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.500" />
          </InputLeftElement>
          <Input
            type="search"
            placeholder="Search by character name..."
            variant="filled"
            focusBorderColor="gray.500"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <InputRightElement width="4.7rem">
            <Button
              variant="solid"
              colorScheme="blackAlpha"
              backgroundColor="gray"
              size="sm"
              onClick={handleSearch}
            >
              Search
            </Button>
          </InputRightElement>
        </InputGroup>
        <Table variant="simple">
          <TableCaption>Rick & Morty Characters</TableCaption>
          <Thead>
            <Tr>
              {columnDefinitions.map((column, index) => (
                <Td key={`col-head-${index}`}>{column.displayName}</Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data?.results?.map((character) => (
              <Tr key={`character-${character.id}`}>
                {columnDefinitions.map((column, index) =>
                  column.renderer ? (
                    <Td key={`character-${character.id}-col-${index}`}>
                      {column.renderer(character)}
                    </Td>
                  ) : (
                    <Td key={`character-${character.id}-col-${index}`}>
                      {character[column.field].toString()}
                    </Td>
                  )
                )}
              </Tr>
            ))}
          </Tbody>
          <Tfoot justifyContent="center">
            <Tr>
              <Td colSpan={4}>
                <Flex justifyContent="center" width="100%">
                  <PaginationControl
                    data={data!}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                </Flex>
              </Td>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};

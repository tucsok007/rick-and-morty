import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import { IPaginatedEndpoint } from '@src/types/data-contracts';
import { PAGINATION_NUMBER_OF_PAGES } from '@src/types/constants';

const calcPaginationArray = <T extends IPaginatedEndpoint>(
  data: T,
  currentPage: number
) => {
  const hasLessThanMimumumPages =
    data?.info.pages! < PAGINATION_NUMBER_OF_PAGES;

  return Array.from(
    Array(
      hasLessThanMimumumPages ? data?.info.pages : PAGINATION_NUMBER_OF_PAGES
    ),
    (() => {
      const overflow = (PAGINATION_NUMBER_OF_PAGES - 1) / 2;

      if (hasLessThanMimumumPages || currentPage <= overflow) {
        return (_, i) => i + 1;
      } else if (currentPage > data?.info.pages! - overflow) {
        return (_, i) =>
          i + 1 + (data?.info.pages! - PAGINATION_NUMBER_OF_PAGES);
      }
      return (_, i) => i + (currentPage - overflow);
    })()
  );
};

interface IPaginationControlProps<T extends IPaginatedEndpoint> {
  data: T;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const PaginationControl = <T extends IPaginatedEndpoint>({
  data,
  currentPage,
  setCurrentPage,
}: IPaginationControlProps<T>): JSX.Element => {
  return (
    <ButtonGroup isAttached variant="outline">
      <IconButton
        icon={<ArrowLeftIcon />}
        aria-label="Go to the first page"
        onClick={() => setCurrentPage(1)}
        isDisabled={!data?.info.prev}
      />
      <Button
        leftIcon={<ChevronLeftIcon />}
        onClick={() => setCurrentPage(currentPage - 1)}
        isDisabled={!data?.info.prev}
        aria-label="Go to the previous page"
      >
        Previous Page
      </Button>
      {calcPaginationArray(data!, currentPage).map((entryPage) => (
        <Button
          key={`button-page-${entryPage}`}
          onClick={() => setCurrentPage(entryPage)}
          isDisabled={entryPage === currentPage}
          aria-label={`Go to page ${entryPage}`}
        >
          {entryPage}
        </Button>
      ))}
      <Button
        rightIcon={<ChevronRightIcon />}
        onClick={() => setCurrentPage(currentPage + 1)}
        isDisabled={!data?.info.next}
        aria-label="Go to the next page"
      >
        Next Page
      </Button>
      <IconButton
        icon={<ArrowRightIcon />}
        onClick={() => setCurrentPage(data?.info.pages!)}
        isDisabled={!data?.info.next}
        aria-label="Go to the last page"
      />
    </ButtonGroup>
  );
};

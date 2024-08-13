import { Box, Flex, Image, Spinner } from '@chakra-ui/react';
import { ICharacter } from '@src/types/data-contracts';

interface IProfileImageProps {
  data: ICharacter;
  size?: number;
}

export const ProfileImage = ({ data, size = 150 }: IProfileImageProps) => {
  return (
    <Image
      src={data?.image}
      boxSize={`${size}px`}
      objectFit="cover"
      fallback={
        <Box boxSize={`${size}px`}>
          <Flex
            alignItems="center"
            justifyContent="center"
            height="100%"
            bgColor="#E2E8F0"
          >
            <Spinner />
          </Flex>
        </Box>
      }
      alt={`${data?.name}'s avatar`}
    />
  );
};

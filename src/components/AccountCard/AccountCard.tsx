import { useContext } from 'react';
import { Heading, Box, Text, Stack, Button, useColorModeValue } from '@chakra-ui/react';
import { CopyIcon, DeleteIcon } from '@chakra-ui/icons';

import NotyfContext from '../../context/NotyfContext';

interface AccountCardProps {
  accountName: string;
  token: string;
  onDeleteClick: () => void;
}

export const AccountCard = ({
  accountName,
  token,
  onDeleteClick,
}: AccountCardProps): JSX.Element => {
  const notyf = useContext(NotyfContext);

  const copy = async (token: string): Promise<void> => {
    await navigator.clipboard.writeText(token);
    notyf.success('Token copied to clipboard!');
  };

  return (
    <Box
      maxW={{ base: '100%', md: '320px' }}
      w="full"
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow="2xl"
      rounded="lg"
      p={6}
      textAlign="center"
    >
      <Heading fontSize="2xl" fontFamily="body">
        {accountName}
      </Heading>

      <Text textAlign="center" color={useColorModeValue('gray.700', 'gray.400')} mt="2">
        {token}
      </Text>

      <Stack mt={8} direction="row" spacing={4}>
        <Button onClick={() => copy(token)} flex={1} fontSize="md" rounded="full">
          <CopyIcon mr="2" /> Copy
        </Button>

        <Button
          onClick={onDeleteClick}
          flex={1}
          fontSize="md"
          rounded="full"
          bg="red.400"
          color="white"
          _hover={{ bg: 'red.500' }}
        >
          <DeleteIcon mr="2" /> Delete
        </Button>
      </Stack>
    </Box>
  );
};

import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useColorModeValue,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  useMediaQuery,
  Button,
  Collapse,
} from '@chakra-ui/react';
import { SearchIcon, SmallCloseIcon } from '@chakra-ui/icons';

import { useStore } from '../../store';

export const Navbar = (): JSX.Element => {
  const accounts = useStore(state => state.accounts);
  const setFilteredAccounts = useStore(state => state.setFilteredAccounts);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);

  const [isMobile] = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    async function getUserData() {
      const session = await getSession();

      setName(session.user.name);
      setEmail(session.user.email);
      setImageUrl(session.user.image);
    }

    getUserData();
  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      const searchResult = accounts.filter(account =>
        account.account.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredAccounts(searchResult);
    } else {
      setFilteredAccounts([]);
    }
  }, [searchTerm]);

  const renderSearch = (): JSX.Element => (
    <HStack>
      <InputGroup>
        <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />

        <Input
          type="text"
          placeholder="Search account"
          size="md"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {searchTerm !== '' && (
          <InputRightElement
            onClick={() => setSearchTerm('')}
            children={<SmallCloseIcon color="gray.300" />}
            cursor="pointer"
          />
        )}
      </InputGroup>
    </HStack>
  );

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Box>Onetime</Box>
        </HStack>

        {!isMobile && renderSearch()}

        <Flex alignItems="flex-end">
          {isMobile && (
            <Button
              bgColor="transparent"
              mr="1"
              onClick={() => setIsSearchVisible(current => !current)}
            >
              <SearchIcon color="gray.300" />
            </Button>
          )}

          <Flex alignItems="center">
            <Menu>
              <MenuButton as={IconButton} variant="none" rounded="full">
                <Avatar size="sm" src={imageUrl} />
              </MenuButton>

              <MenuList>
                <MenuItem as="div" style={{ display: 'block' }}>
                  <Text fontSize="sm">{name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {email}
                  </Text>
                </MenuItem>

                <MenuDivider />

                <MenuItem
                  fontSize="sm"
                  onClick={() => signOut({ callbackUrl: process.env.NEXT_PUBLIC_BASE_URL })}
                >
                  Sign out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Flex>

      {isMobile && (
        <Collapse in={isSearchVisible} animateOpacity>
          <Box pb="6">{renderSearch()}</Box>
        </Collapse>
      )}
    </Box>
  );
};

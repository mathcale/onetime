import { useEffect, useState } from 'react';
import { getSession, signOut } from 'next-auth/client';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

export const Navbar = (): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    async function getUserData() {
      const session = await getSession();

      setName(session.user.name);
      setEmail(session.user.email);
      setImageUrl(session.user.image);
    }

    getUserData();
  }, []);

  return (
    <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Box>Onetime</Box>
        </HStack>

        <Flex alignItems="center">
          <Menu>
            <MenuButton as={Button} rounded="full" variant="link" cursor="pointer">
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
    </Box>
  );
};

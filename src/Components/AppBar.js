import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Spacer,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  useDisclosure,
  VStack,
  Text,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

const AppBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });

  return (
    <Box
      bg="gray.800"  // Change this color to suit your theme
      color="gold"
      px={useBreakpointValue({ base: 2, sm: 4, md: 8, lg: 16 })}
      py={useBreakpointValue({ base: 2, md: 4 })}
      boxShadow="0px 8px 16px rgba(0, 0, 0, 0.3)"
    >
      <Flex align="center" h={16} justify="space-between">
        {/* Hamburger Icon */}
        {!isDesktop && (
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open Menu"
            onClick={onOpen}
            variant="outline"
            colorScheme="teal"
            bg="gray.600"
            color="gold"
          />
        )}
        {/* App Title */}
        <Heading size="lg" color="gold">
          Sperax Crypto Portfolio
        </Heading>
        <Spacer />
        {/* Desktop Menu Items */}
        {isDesktop && (
          <Flex gap={4}>
            <Link to="/home">
              <Button colorScheme="teal" variant="solid" bg="gold" color="black">
                Home
              </Button>
            </Link>
            <Link to="/watchlist">
              <Button colorScheme="teal" variant="solid" bg="gold" color="black">
                Watchlist
              </Button>
            </Link>
            <Link to="/profile">
              <Button colorScheme="teal" variant="solid" bg="gold" color="black">
                Profile
              </Button>
            </Link>
            <Link to="/">
              <Button colorScheme="teal" variant="solid" bg="gold" color="black">
                Logout
              </Button>
            </Link>
          </Flex>
        )}
      </Flex>

      {/* Mobile Drawer */}
      {!isDesktop && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader bg="gray.800" color="gold">
              Menu
            </DrawerHeader>
            <DrawerBody bg="gray.700" color="gold">
              <VStack spacing={4} align="start">
                <Link to="/home" onClick={onClose}>
                  <Text fontSize="lg">Home</Text>
                </Link>
                <Link to="/watchlist" onClick={onClose}>
                  <Text fontSize="lg">Watchlist</Text>
                </Link>
                <Link to="/profile" onClick={onClose}>
                  <Text fontSize="lg">Profile</Text>
                </Link>
                <Link to="/" onClick={onClose}>
                  <Text fontSize="lg">Logout</Text>
                </Link>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
};

export default AppBar;

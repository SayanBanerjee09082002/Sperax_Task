import React, { useState } from 'react';
import {
  Box,
  Flex,
  Heading,
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
import { Link, useLocation } from 'react-router-dom';
import SelectButton from './SelectButton'; // Import your custom SelectButton

const AppBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const location = useLocation(); // Get the current location
  const [selectedRoute, setSelectedRoute] = useState(location.pathname); // Set the initial selected route to the current path

  const handleSelect = (route) => {
    setSelectedRoute(route); // Update the selected route when a button is clicked
  };

  return (
    <Box
      bg="gray.800"
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
            <Link to="/home" onClick={() => handleSelect('/home')}>
              <SelectButton selected={selectedRoute === '/home'}>Home</SelectButton>
            </Link>
            <Link to="/watchlist" onClick={() => handleSelect('/watchlist')}>
              <SelectButton selected={selectedRoute === '/watchlist'}>Watchlist</SelectButton>
            </Link>
            <Link to="/profile" onClick={() => handleSelect('/profile')}>
              <SelectButton selected={selectedRoute === '/profile'}>Profile</SelectButton>
            </Link>
            <Link to="/allowance" onClick={() => handleSelect('/allowance')}>
              <SelectButton selected={selectedRoute === '/allowance'}>Allowance</SelectButton>
            </Link>
            <Link to="/" onClick={() => handleSelect('/')}>
              <SelectButton selected={selectedRoute === '/'}>Logout</SelectButton>
            </Link>
          </Flex>
        )}
      </Flex>

      {/* Mobile Drawer */}
      {!isDesktop && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader bg="gray.800" color="gold">Menu</DrawerHeader>
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

import React, { useState } from 'react';
import { Box, Button, Input, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { db, auth } from '../Config/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const validateWalletAddress = (address) => {
    return address.length === 42 && address.startsWith('0x'); // Basic validation for Ethereum addresses
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateWalletAddress(walletAddress)) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid wallet address.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to add a wallet.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate('/'); // Redirect to login page
        return;
      }

      const walletRef = collection(db, 'wallets');
      await addDoc(walletRef, {
        userId: user.uid,
        address: walletAddress,
        watchList: [],
        createdAt: new Date()
      });

      toast({
        title: "Wallet Added",
        description: "Your wallet address has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/home');
    } catch (error) {
      console.error("Error adding wallet address:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding your wallet address.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      bgImage="url(./banner.jpg)"
      bgSize="cover"
      bgPosition="center"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="white"
      textAlign="center"
    >
      <VStack spacing={4}>
        <Heading fontSize={64}>
          Add Wallet
        </Heading>
        <Text fontSize={18}>
          Enter your wallet address to create a watch list and manage your tokens.
        </Text>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={handleWalletAddressChange}
            mb={4}
            color="white"
            _placeholder={{ color: "gray.400" }}
            bg="rgba(255, 255, 255, 0.1)"
          />
          <Button
            colorScheme="yellow"
            bgGradient="linear(to-b, #f0ff00,   #ff9a00)"
            color="black"
            size="lg"
            type="submit"
            isLoading={loading}
          >
            Add Wallet
          </Button>
        </form>
      </VStack>
    </Box>
  );
};

export default WalletPage;
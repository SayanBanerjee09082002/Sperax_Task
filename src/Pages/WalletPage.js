import React, { useState } from 'react';
import { Box, Button, Input, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { db } from '../Firebase'; // Import Firebase database
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../Firebase';

const WalletPage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleWalletAddressChange = (e) => {
    setWalletAddress(e.target.value);
  };

  const validateWalletAddress = (address) => {
    // Basic validation for wallet address (you might need more complex validation based on the wallet type)
    return address.length === 42 && address.startsWith('0x'); // Example validation for Ethereum addresses
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
      const user = auth.currentUser; // Get the current user directly from Firebase auth
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
  
      // Store the wallet address and userId in Firestore
      const walletRef = collection(db, 'wallets');
      await addDoc(walletRef, {
        userId: user.uid, // Store the authenticated user's uid
        address: walletAddress,
        watchList: [], // Initialize with an empty watch list
        createdAt: new Date()
      });
  
      toast({
        title: "Wallet Added",
        description: "Your wallet address has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate('/home'); // Redirect to homepage after successful addition
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
        <Heading fontSize={64}> {/* Increased font size */}
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
            color="white" // Make the input text white
            _placeholder={{ color: "gray.400" }} // Make the placeholder text gray
            bg="rgba(255, 255, 255, 0.1)" // Slightly transparent background for better visibility
          />
          <Button 
            colorScheme="yellow" 
            bg="gold" 
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

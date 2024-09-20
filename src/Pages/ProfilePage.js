import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Input,
  useBreakpointValue,
  useToast,
  Button,
  IconButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { app, db } from '../Config/Firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { EditIcon } from '@chakra-ui/icons';
import TransferForm from '../Components/TransferForm';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState('');
  const [newWallet, setNewWallet] = useState('');
  const [editing, setEditing] = useState(false);
  const toast = useToast();
  const auth = getAuth(app);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        setUser(currentUser);
        const walletAddress = await fetchWalletData(currentUser.uid);
        setWallet(walletAddress || '');
      }
    };

    const fetchWalletData = async (userId) => {
      try {
        const walletQuery = query(collection(db, 'wallets'), where('userId', '==', userId));
        const querySnapshot = await getDocs(walletQuery);
        if (querySnapshot.empty) return '';
        const walletDoc = querySnapshot.docs[0];
        const walletData = walletDoc.data();
        return walletData.address || '';
      } catch (error) {
        console.error('Error fetching wallet address:', error);
        return '';
      }
    };

    fetchUserData();
  }, [auth]);

  const handleWalletUpdate = async () => {
    if (user) {
      const walletRef = collection(db, 'wallets');
      const walletQuery = query(walletRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(walletQuery);

      if (!querySnapshot.empty) {
        const walletDoc = querySnapshot.docs[0].ref;
        try {
          await updateDoc(walletDoc, { address: newWallet });
          setWallet(newWallet);
          setEditing(false);
          toast({
            title: 'Wallet address updated.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } catch (error) {
          console.error('Error updating wallet address:', error);
          toast({
            title: 'Error updating wallet address.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        console.error('No wallet address document found to update');
        toast({
          title: 'No wallet address found.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  const paddingX = useBreakpointValue({ base: 2, sm: 4, md: 8 });

  return (
    <Flex direction="column" p={paddingX} align="center" maxW="container.sm" mx="auto">
      <Box p={4} mb={4} textAlign="center">
        <Image
          src={user?.photoURL || '/default-profile.png'}
          alt="Profile"
          borderRadius="full"
          boxSize="150px"
          mx="auto"
          mb={4}
        />
        <Heading as="h2" size="lg" mb={2}>
          {user?.displayName || 'User'}
        </Heading>
        <Text mb={2}>{user?.email}</Text>
      </Box>

      <Box p={4} textAlign="center" w="full">
        <Flex align="center" mb={4}>
          <FormControl>
            <FormLabel htmlFor="walletAddress" fontSize="lg" mb={0}>
              Wallet Address:
            </FormLabel>
            <Flex align="center">
              <Text id="walletAddress" fontSize="lg" mr={4}>
                {wallet}
              </Text>
              <IconButton
                icon={<EditIcon />}
                aria-label="Edit Wallet Address"
                onClick={() => setEditing(!editing)}
                color="black"
                bgGradient="linear(to-b, #f0ff00,   #ff9a00)"
                _hover={{ bg: "yellow.400" }}
              />
            </Flex>
          </FormControl>
        </Flex>
        {editing && (
          <>
            <Input
              placeholder="Update wallet address"
              value={newWallet}
              onChange={(e) => setNewWallet(e.target.value)}
              mb={4}
              bg="gray.700"
              color="white"
            />
            <Button
              onClick={handleWalletUpdate}
              color="black"
              bgGradient="linear(to-b, #f0ff00,   #ff9a00)"
              _hover={{ bg: "yellow.400" }}
            >
              Update Wallet Address
            </Button>
          </>
        )}
      </Box>

      <TransferForm />
    </Flex>
  );
};

export default ProfilePage;
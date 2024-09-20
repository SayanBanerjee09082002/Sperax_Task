import React from 'react';
import { Box, Button, Heading, Text, VStack, Image } from '@chakra-ui/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../Config/Firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          email: user.email,
          createdAt: new Date(),
        });
        navigate('/wallet');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
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
          Sperax
        </Heading>
        <Text fontSize={18}>
          Securely Manage, Trade, and Grow Your Digital Assets — All in One Place
        </Text>
        <Button
          colorScheme="yellow"
          bg="gold"
          color="black"
          size="lg"
          leftIcon={<Image src="./google.png" boxSize="40px" />}
          onClick={handleLogin}
          pl={3}
          marginTop={24}
        >
          Sign in with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginPage;
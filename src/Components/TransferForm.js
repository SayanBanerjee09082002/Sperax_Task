import React, { useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
import ErrorMessage from './ErrorMessage';
import TxList from './TxList';
const ethers = require("ethers");

const startPayment = async ({ setError, setTxs, ether, addr }) => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');

    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const validatedAddr = ethers.getAddress(addr);

    const tx = await signer.sendTransaction({
      to: validatedAddr,
      value: ethers.parseEther(ether),
    });

    const receipt = await tx.wait();
    setTxs([receipt]);
  } catch (err) {
    setError(err.message);
  }
};

export default function TransferForm() {
  const [error, setError] = useState('');
  const [txs, setTxs] = useState([]);
  const [ether, setEther] = useState('');
  const [addr, setAddr] = useState('');
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    await startPayment({ setError, setTxs, ether, addr });
    if (!error) {
      toast({
        title: 'Transaction sent!',
        description: 'Your transaction was successfully sent.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={4} mb={4} textAlign="center" bg="gray.800" w="full">
      <Flex direction="column" align="left">
        <Box mb={4} textAlign="left">
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>Send ETH Payment</h1>
        </Box>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel htmlFor="addr" color="white">Recipient Address:</FormLabel>
            <Input
              id="addr"
              name="addr"
              type="text"
              value={addr}
              onChange={(e) => setAddr(e.target.value)}
              placeholder="Recipient Address"
              bg="rgba(255, 255, 255, 0.1)"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel htmlFor="ether" color="white">Token Amount:</FormLabel>
            <Input
              id="ether"
              name="ether"
              type="text"
              value={ether}
              onChange={(e) => setEther(e.target.value)}
              placeholder="Amount in ETH"
              bg="rgba(255, 255, 255, 0.1)"
              _placeholder={{ color: "gray.400" }}
            />
          </FormControl>
          <Button
            type="submit"
            bgGradient="linear(to-b, #f0ff00,   #ff9a00)"
            color="black"
            _hover={{ bg: "yellow.400" }}
            width="full"
            marginTop={4}
            marginBottom={2}
          >
            Pay Now
          </Button>
        </form>
        <ErrorMessage message={error} />
        <TxList txs={txs} />
      </Flex>
    </Box>
  );
}
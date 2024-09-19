import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, Table, Thead, Tbody, Tr, Th, Td, Container, CircularProgress, useToast, Heading } from '@chakra-ui/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../Firebase'; // Assuming firebase is configured in firebase.js

const ethers = require('ethers');

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
const API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY; // Add this to your .env file

const Allowance = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [allowanceData, setAllowanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        const fetchUserData = async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const wallet = await fetchWalletAddress(currentUser.uid);
                setWalletAddress(wallet || '');
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            handleSearch();
        }
    }, [walletAddress]);

    const fetchWalletAddress = async (userId) => {
        try {
            const walletQuery = query(collection(db, 'wallets'), where('userId', '==', userId));
            const querySnapshot = await getDocs(walletQuery);
            if (!querySnapshot.empty) {
                const walletDoc = querySnapshot.docs[0];
                const walletData = walletDoc.data();
                return walletData.address || '';
            } else {
                toast({
                    title: 'No wallet address found.',
                    status: 'warning',
                    duration: 4000,
                    isClosable: true,
                });
                return '';
            }
        } catch (error) {
            console.error('Error fetching wallet address:', error);
            return '';
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError('');
        setAllowanceData([]);

        try {
            const contracts = await fetchTokenBalances(walletAddress);
            if (contracts.length === 0) {
                setError('No tokens found for this wallet.');
            } else {
                const allowances = await Promise.all(
                    contracts.map(async (contract) => {
                        const allowance = await fetchAllowance(walletAddress, contract.contractAddress);
                        return { contractAddress: contract.contractAddress, allowance };
                    })
                );
                setAllowanceData(allowances);
            }
        } catch (error) {
            console.error('Error fetching token allowances:', error);
            setError('Error fetching allowances. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTokenBalances = async (walletAddress) => {
        try {
            const response = await axios.get(ETHERSCAN_API_URL, {
                params: {
                    module: 'account',
                    action: 'tokentx',
                    address: walletAddress,
                    apikey: API_KEY,
                },
            });

            // Check if the response contains a result
            if (response.data && Array.isArray(response.data.result)) {
                const transactions = response.data.result;

                // Find unique contract addresses from the transactions
                const uniqueContracts = transactions.reduce((acc, tx) => {
                    if (!acc.some((contract) => contract.contractAddress === tx.contractAddress)) {
                        acc.push({ contractAddress: tx.contractAddress });
                    }
                    return acc;
                }, []);

                return uniqueContracts;
            } else {
                console.error("Etherscan API returned an invalid result:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error fetching token balances:", error);
            return [];
        }
    };


    const fetchAllowance = async (walletAddress, contractAddress) => {
        const response = await axios.get(ETHERSCAN_API_URL, {
            params: {
                module: 'account',
                action: 'tokenallowance',
                contractaddress: contractAddress,
                address: walletAddress,
                spender: walletAddress, // Assuming self-check (wallet as spender)
                apikey: API_KEY,
            },
        });

        const allowance = response.data.result;
        return ethers.utils.formatUnits(allowance, 18); // Assume token has 18 decimals
    };

    return (
        <Container maxW="lg" mt={10}>
            <Heading as="h1" size="xl" my={4} textAlign="center">Token Allowance Checker</Heading>

            {error && <Text color="red.500" mt={4}>{error}</Text>}

            {isLoading && <CircularProgress isIndeterminate color="teal" mt={4} />}

            {allowanceData.length > 0 && !isLoading && (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>Contract Address</Th>
                            <Th>Token Allowance</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {allowanceData.map((data, index) => (
                            <Tr key={index}>
                                <Td>{data.contractAddress}</Td>
                                <Td>{data.allowance} tokens</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Container>
    );
};

export default Allowance;

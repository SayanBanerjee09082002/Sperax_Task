import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import {
  Input,
  Container,
  Heading,
  VStack,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  TableContainer,
  Spinner,
  Box,
  useBreakpointValue,
  Flex,
  Image,
  Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CoinList } from '../config/api.js';

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const paddingX = useBreakpointValue({ base: 2, sm: 4, md: 8, lg: 0 });
  const marginY = useBreakpointValue({ base: 2, md: 4, lg: 4 });

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList('usd'));
      setCoins(data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleRowClick = (coinId) => {
    navigate(`/coins/${coinId}`);
  };

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, coins]);

  return (
    <Container maxW="container.xl" centerContent px={paddingX} py={marginY}>
      <VStack spacing={4} align="stretch" w="100%">
        <Heading as="h1" size="xl" my={4} textAlign="center">
          Cryptocurrency Prices by Market Cap
        </Heading>

        <Input
          placeholder="Search for a cryptocurrency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mb={4}
          height="60px"
        />

        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Box w="100%" overflowX="auto">
            <Box borderRadius="md" overflow="hidden">
              <TableContainer minW="full">
                <Table variant="simple" size="lg">
                  <Thead>
                    <Tr bg="gold" borderRadius="md">
                      <Th fontSize="lg" fontWeight="bold" color="black">
                        Coin
                      </Th>
                      <Th fontSize="lg" fontWeight="bold" color="black">
                        Price
                      </Th>
                      <Th fontSize="lg" fontWeight="bold" color="black">
                        24h Change
                      </Th>
                      <Th fontSize="lg" fontWeight="bold" color="black">
                        Market Cap
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredCoins.map((coin) => (
                      <Tr
                        key={coin.id}
                        onClick={() => handleRowClick(coin.id)}
                        cursor="pointer"
                        borderBottom="2px solid #555555"
                        _hover={{ backgroundColor: "#1c1e22", cursor: "pointer" }} 
                      >
                        <Td>
                          <Flex align="center">
                            <Box mr={4}>
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                boxSize="50px"
                              />
                            </Box>
                            <Box>
                              <Text fontWeight="bold" fontSize="lg">
                                {coin.symbol.toUpperCase()}
                              </Text>
                              <Text fontSize="md" color="gray.500">
                                {coin.name}
                              </Text>
                            </Box>
                          </Flex>
                        </Td>
                        <Td>${coin.current_price.toLocaleString()}</Td>
                        <Td
                          color={
                            coin.price_change_percentage_24h > 0
                              ? 'green.400'
                              : 'red.400'
                          }
                        >
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </Td>
                        <Td>${coin.market_cap.toLocaleString()}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default CoinsTable;

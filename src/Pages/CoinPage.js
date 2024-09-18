import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Flex, Heading, Image, Text, VStack, Spinner, Divider, Button } from '@chakra-ui/react';
import CoinInfo from '../Components/CoinInfo';
import { SingleCoin } from '../config/api';
import { CryptoState } from '../CryptoContext'; // Custom hook
import { doc, updateDoc, arrayUnion, arrayRemove, getDocs, collection, query, where } from "firebase/firestore";
import { db, auth } from "../Firebase"; // Ensure the correct Firebase config path

const numberWithCommas = (x) => {
  if (x === undefined) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const [inWatchlist, setInWatchlist] = useState(false); // State to track if the coin is in the watchlist
  const { currency, symbol } = CryptoState(); // Use the custom hook

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(SingleCoin(id));
        setCoin(data);
      } catch (error) {
        console.error("Error fetching coin data:", error);
      }
    };

    const checkWatchlist = async () => {
      const user = auth.currentUser;

      if (!user) return;

      try {
        // Query to find the wallet document where the 'userId' matches the logged-in user's ID
        const walletQuery = query(collection(db, 'wallets'), where('userId', '==', user.uid));
        const walletSnap = await getDocs(walletQuery); // Get the documents matching the query

        if (!walletSnap.empty) {
          // Loop through the query results (assuming one document for the user)
          walletSnap.forEach((docSnap) => {
            const walletData = docSnap.data();
            if (walletData.watchList?.includes(id)) {
              setInWatchlist(true); // Coin is in the watchlist
            }
          });
        }
      } catch (error) {
        console.error("Error checking watchlist: ", error);
      }
    };

    fetchCoin();
    checkWatchlist();
  }, [id]);

  const addToWatchlist = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to add coins to your watchlist.");
      return;
    }

    try {
      const walletQuery = query(collection(db, 'wallets'), where('userId', '==', user.uid));
      const walletSnap = await getDocs(walletQuery);

      if (!walletSnap.empty) {
        walletSnap.forEach(async (docSnap) => {
          const walletRef = doc(db, 'wallets', docSnap.id);

          await updateDoc(walletRef, {
            watchList: arrayUnion(coin.id),
          });

          setInWatchlist(true);
          alert(`${coin.name} added to your watchlist!`);
        });
      }
    } catch (error) {
      console.error("Error adding coin to watchlist: ", error);
    }
  };

  const removeFromWatchlist = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to remove coins from your watchlist.");
      return;
    }

    try {
      const walletQuery = query(collection(db, 'wallets'), where('userId', '==', user.uid));
      const walletSnap = await getDocs(walletQuery);

      if (!walletSnap.empty) {
        walletSnap.forEach(async (docSnap) => {
          const walletRef = doc(db, 'wallets', docSnap.id);

          await updateDoc(walletRef, {
            watchList: arrayRemove(coin.id),
          });

          setInWatchlist(false);
          alert(`${coin.name} removed from your watchlist!`);
        });
      }
    } catch (error) {
      console.error("Error removing coin from watchlist: ", error);
    }
  };

  if (!coin) return <Spinner size="xl" color="gold" />;

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      p={4}
      align="flex-start"
      spacing={4}
    >
      <Box
        flex={{ base: "none", md: "1" }}
        p={4}
        borderWidth={1}
        borderRadius="md"
        borderColor="transparent"
        bg="transparent"
        mb={{ base: 4, md: 0 }}
        textAlign="center"
      >
        <Image
          src={coin?.image.large}
          alt={coin?.name}
          boxSize="200px"
          mb={4}
          mx="auto"
        />
        <Heading as="h3" size="lg" mb={4}>
          {coin?.name}
        </Heading>
        <Text mb={4}>
          {coin?.description.en.split(". ")[0]}.
        </Text>
        <VStack spacing={4} align="center">
          <Flex justifyContent="center">
            <Text fontWeight="bold">Rank:</Text>
            <Text ml={2}>{numberWithCommas(coin?.market_cap_rank)}</Text>
          </Flex>
          <Flex justifyContent="center">
            <Text fontWeight="bold">Current Price:</Text>
            <Text ml={2}>{symbol} {numberWithCommas(coin?.market_data.current_price[currency.toLowerCase()])}</Text>
          </Flex>
          <Flex justifyContent="center">
            <Text fontWeight="bold">Market Cap:</Text>
            <Text ml={2}>{symbol} {numberWithCommas(coin?.market_data.market_cap[currency.toLowerCase()].toString().slice(0, -6))} M</Text>
          </Flex>
          <Button
            onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
            paddingLeft={8}
            paddingRight={8}
            marginTop={8}
            colorScheme="gold"
            color="black"
            bg="gold"
            _hover={{ bg: "yellow.400" }}
            size="lg" // Constant button size
            width="300px" // Fixed width for consistenc
          >
            {inWatchlist ? "Remove From Watchlist" : "Add To Watchlist"}
          </Button>
        </VStack>
      </Box>
      <Divider orientation="vertical" borderColor="gray.600" />
      <Box
        flex={{ base: "none", md: "2" }}
        mt={{ base: 4, md: 0 }}
        p={4}
        borderWidth={1}
        borderRadius="md"
        borderColor="transparent"
        bg="transparent"
      >
        <CoinInfo coin={coin} />
      </Box>
    </Flex>
  );
};

export default CoinPage;

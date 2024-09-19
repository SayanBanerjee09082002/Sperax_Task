import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Text,
  Image,
  useTheme
} from '@chakra-ui/react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

// API URL for trending coins
const TrendingCoins = (currency) => 
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1&sparkline=false`;

// Helper function to format numbers with commas
const numberWithCommas = (x) => {
  if (x === undefined) return "";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const [currency] = useState('usd');
  const { colors } = useTheme();

  // Fetch trending coins from the API
  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);  // Set the fetched data in state
    } catch (error) {
      console.error("Error fetching the trending coins:", error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  // Safeguard: Ensure trending is defined and an array
  const items = trending?.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link to={`/coins/${coin.id}`} style={{ textDecoration: 'none' }} key={coin.id}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          textTransform="uppercase"
          color="white"
          p={4}
          w="120px" // Adjust the width for better fit
        >
          <Image
            src={coin?.image}
            alt={coin.name}
            boxSize="50px"  // Adjust size of coin image
            mb={2}
          />
          <Text fontSize="md" fontWeight="bold">
            {coin?.symbol.toUpperCase()}
            &nbsp;
            <Text
              as="span"
              color={profit ? 'green.400' : 'red.400'}
              fontWeight="bold"
            >
              {profit && "+"}
              {coin?.price_change_percentage_24h?.toFixed(2)}%
            </Text>
          </Text>
          <Text fontSize="lg" fontWeight="bold">
            ${numberWithCommas(coin?.current_price.toFixed(2))}
          </Text>
        </Box>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 1, // Show 1 item for small screens
    },
    512: {
      items: 3, // Show 3 items for medium and larger screens
    },
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      bg={colors.gray[800]}
      p={4}
      width="100%"
      height="400px"
    >
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </Box>
  );
};

export default Carousel;

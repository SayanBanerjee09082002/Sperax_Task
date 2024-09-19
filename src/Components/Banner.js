import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Banner = () => {
    return (
        <Box
            backgroundImage="url(./banner.jpg)"
            height="400px"
            display="flex"
            flexDirection="column"
            paddingTop="25px"
            paddingBottom="25px"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
        >
            <Heading
                as="h2"
                fontWeight="bold"
                marginBottom="10px"
                fontFamily="Montserrat"
                fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
            >
                Sperax
            </Heading>
            <Text
                fontSize="lg"
                color="darkgrey"
                textTransform="capitalize"
                fontFamily="Montserrat"
            >
                Securely Manage, Trade, and Grow Your Digital Assets — All in One Place
            </Text>
        </Box>
    );
};

export default Banner;
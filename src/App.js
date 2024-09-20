import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import HomePage from './Pages/HomePage';
import CoinPage from './Pages/CoinPage';
import LoginPage from './Pages/LoginPage'; // Import the LoginPage
import AppBar from './Components/AppBar';
import CryptoContext from './CryptoContext';
import WalletPage from './Pages/WalletPage'; // Import WalletPage
import ProfilePage from './Pages/ProfilePage'; // Import ProfilePage
import WatchlistPage from './Pages/WatchlistPage';
import Allowance from './Pages/AllowancePage';

function App() {
  return (
    <ChakraProvider>
      <CryptoContext>
        <Router>
          <Box bg="#14161a" color="white" minH="100vh">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route 
                path="/home" 
                element={
                  <>
                    <AppBar /> {/* Render AppBar for HomePage */}
                    <HomePage />
                  </>
                } 
              />
              <Route 
                path="/coins/:id" 
                element={
                  <>
                    <AppBar /> {/* Render AppBar for CoinPage */}
                    <CoinPage />
                  </>
                } 
              />
              <Route 
                path="/wallet" 
                element={
                  <>
                    <WalletPage />
                  </>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <>
                    <AppBar /> {/* Render AppBar for ProfilePage */}
                    <ProfilePage />
                  </>
                } 
              />
              <Route 
                path="/watchlist" 
                element={
                  <>
                    <AppBar /> {/* Render AppBar for ProfilePage */}
                    <WatchlistPage />
                  </>
                } 
              />
              <Route 
                path="/allowance" 
                element={
                  <>
                    <AppBar /> {/* Render AppBar for ProfilePage */}
                    <Allowance />
                  </>
                } 
              />
            </Routes>
          </Box>
        </Router>
      </CryptoContext>
    </ChakraProvider>
  );
}

export default App;

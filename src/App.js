import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import HomePage from './Pages/HomePage';
import CoinPage from './Pages/CoinPage';
import LoginPage from './Pages/LoginPage';
import AppBar from './Components/AppBar';
import CryptoContext from './Config/CryptoContext';
import WalletPage from './Pages/WalletPage';
import ProfilePage from './Pages/ProfilePage';
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
                    <AppBar />
                    <HomePage />
                  </>
                }
              />
              <Route
                path="/coins/:id"
                element={
                  <>
                    <AppBar />
                    <CoinPage />
                  </>
                }
              />
              <Route
                path="/wallet"
                element={<WalletPage />}
              />
              <Route
                path="/profile"
                element={
                  <>
                    <AppBar />
                    <ProfilePage />
                  </>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <>
                    <AppBar />
                    <WatchlistPage />
                  </>
                }
              />
              <Route
                path="/allowance"
                element={
                  <>
                    <AppBar />
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
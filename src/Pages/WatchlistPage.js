import React from 'react';
import Banner from "../Components/Banner"
import WatchlistTable from '../Components/WatchlistTable';
import Carousel from '../Components/Carousel';

const WatchlistPage = () => {
  return (
    <div>
      <Carousel />
      <WatchlistTable />
    </div>
  );
};

export default WatchlistPage;
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import HeroSection from '../../components/HeroSection/HeroSection';

const Home = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Home;
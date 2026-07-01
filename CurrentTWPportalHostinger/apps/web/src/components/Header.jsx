import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container py-6">
        <Link 
          to="/" 
          className="inline-block transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <img 
            src="https://horizons-cdn.hostinger.com/cf38ed95-747e-4f5c-bcd0-c1f5339601dd/7575353cd9318df03ae5c4e4060713d5.png" 
            alt="The Witness Protocol" 
            className="h-10 w-auto invert"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
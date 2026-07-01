import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Page not found | Witness Protocol Foundation`}</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-16">
        <div className="container max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              Page not found
            </h1>
            <p className="text-xl text-muted-foreground mb-8 mx-auto">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-lg hover:bg-accent/90 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Home size={20} />
              Back to home
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const NavigationCard = ({ title, description, to, href, icon: Icon }) => {
  const cardContent = (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-2" style={{ fontFamily: '"Libre Baskerville", serif' }}>
            {title}
          </h3>
          {Icon && (
            <div className="text-accent mb-3">
              <Icon size={32} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <ArrowRight className="text-muted-foreground group-hover:text-accent transition-colors duration-200" size={24} />
      </div>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </>
  );

  const cardClasses = "group block bg-card border border-border rounded-xl p-6 transition-all duration-200 hover:border-accent hover:shadow-lg hover:shadow-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (to) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Link to={to} className={cardClasses}>
          {cardContent}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a href={href} target="_blank" rel="noopener noreferrer" className={cardClasses}>
          {cardContent}
        </a>
      </motion.div>
    );
  }

  return null;
};

export default NavigationCard;
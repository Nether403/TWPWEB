import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Globe, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const FounderPage = () => {
  return (
    <>
      <Helmet>
        <title>{`About the Founder | Witness Protocol Foundation`}</title>
        <meta name="description" content="Meet Martin vanDeursen, founder of The Witness Protocol." />
      </Helmet>

      <div className="relative min-h-[calc(100vh-89px)] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://horizons-cdn.hostinger.com/cf38ed95-747e-4f5c-bcd0-c1f5339601dd/0c2b95ea260c29949911821c7a39159f.jpg" 
            alt="Martin vanDeursen in a dark urban setting with a glowing blue orb" 
            className="w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/30 md:to-transparent" />
        </div>

        <div className="container relative z-10 py-24">
          <div className="max-w-2xl">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-200 mb-12 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, ease: "easeOut" }} 
              className="bg-background/40 backdrop-blur-md border border-border/30 p-8 md:p-10 rounded-2xl shadow-2xl mb-8"
            >
              <h1 className="text-4xl md:text-5xl mb-2 text-foreground" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                Martin vanDeursen
              </h1>
              <h2 className="text-xl md:text-2xl text-accent mb-8 font-medium" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                Founder, The Witness Protocol
              </h2>

              <div className="space-y-6 text-foreground/90 text-lg leading-relaxed">
                <p>
                  An AI developer and system architect based in the Netherlands, Martinus walked away from the commercial AI development race to focus entirely on building a high-signal ethical inheritance for future intelligence.
                </p>
                <p>
                  He builds systems that prioritize truth, signal quality, and documented human reasoning over raw scale and web noise.
                </p>
                <p>
                  The Witness Protocol is his bet that humanity's legacy shouldn't be left to uncurated data scraping, but carefully architected through structured dialogue and unyielding operational constraints.
                </p>
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="contact-card">
                <h3 className="contact-group-title">Communication</h3>
                <div className="contact-links-container">
                  <a href="mailto:Founder@twpf.online" className="contact-link" target="_blank" rel="noopener noreferrer">
                    <Mail className="contact-icon" />
                    <span>Founder@twpf.online</span>
                  </a>
                  <a href="mailto:Martin@101dev.xyz" className="contact-link" target="_blank" rel="noopener noreferrer">
                    <Mail className="contact-icon" />
                    <span>Martin@101dev.xyz</span>
                  </a>
                </div>
              </div>

              <div className="space-y-6">
                <div className="contact-card">
                  <h3 className="contact-group-title">Personal</h3>
                  <div className="contact-links-container">
                    <a href="https://101dev.xyz" className="contact-link" target="_blank" rel="noopener noreferrer">
                      <Globe className="contact-icon" />
                      <span>101dev.xyz</span>
                    </a>
                  </div>
                </div>

                <div className="contact-card">
                  <h3 className="contact-group-title">Social</h3>
                  <div className="contact-links-container">
                    <a href="https://www.linkedin.com/in/mvd101" className="contact-link" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="contact-icon" />
                      <span>LinkedIn</span>
                    </a>
                    <a href="https://github.com/Nether403/" className="contact-link" target="_blank" rel="noopener noreferrer">
                      <Github className="contact-icon" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FounderPage;
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const InfoPage = () => {
  return (
    <>
      <Helmet>
        <title>{`About | Witness Protocol Foundation`}</title>
        <meta name="description" content="Learn about the Witness Protocol Foundation's mission to advance decentralized verification and computational integrity." />
      </Helmet>

      <div className="min-h-screen py-16">
        <div className="container max-w-4xl">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-12"
          >
            <ArrowLeft size={20} />
            Back to home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-8" style={{ fontFamily: '"Libre Baskerville", serif' }}>
              About the foundation
            </h1>

            <div className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Our mission
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Witness Protocol Foundation is dedicated to advancing the field of decentralized verification and computational integrity. We focus on developing and promoting witness protocols, zero-knowledge proof systems, and verifiable computation frameworks that enable trustless interactions in distributed systems.
                </p>
                <p className="text-muted-foreground">
                  Our work bridges theoretical cryptography with practical implementation, creating tools and standards that empower developers to build secure, verifiable applications without relying on centralized trust assumptions.
                </p>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Research areas
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Zero-knowledge proof systems and their applications in privacy-preserving computation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Witness protocols for decentralized verification and consensus mechanisms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Verifiable computation frameworks for trustless distributed systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Cryptographic primitives for secure multi-party computation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Standards and protocols for interoperable verification systems</span>
                  </li>
                </ul>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Our approach
                </h2>
                <p className="text-muted-foreground mb-4">
                  We believe that computational integrity is fundamental to the future of decentralized systems. By developing robust witness protocols and verification mechanisms, we enable applications to prove their correctness without revealing sensitive information or relying on trusted intermediaries.
                </p>
                <p className="text-muted-foreground">
                  Our research combines rigorous cryptographic foundations with practical engineering, ensuring that our protocols are both theoretically sound and implementable in real-world systems.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
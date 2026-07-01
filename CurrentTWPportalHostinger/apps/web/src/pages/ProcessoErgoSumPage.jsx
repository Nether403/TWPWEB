import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessoErgoSumPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Processo Ergo Sum | Witness Protocol Foundation`}</title>
        <meta name="description" content="Exploring computational identity and the philosophical foundations of verifiable computation." />
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
              Processo Ergo Sum
            </h1>

            <div className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  I process, therefore I am
                </h2>
                <p className="text-muted-foreground mb-4">
                  Processo Ergo Sum explores the intersection of computational identity and philosophical inquiry. In an age where computation increasingly defines our interactions, we examine what it means to exist as a verifiable entity in distributed systems.
                </p>
                <p className="text-muted-foreground">
                  This project investigates how witness protocols and zero-knowledge proofs enable new forms of identity that are both private and verifiable, allowing entities to prove properties about themselves without revealing underlying data.
                </p>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Computational identity
                </h2>
                <p className="text-muted-foreground mb-4">
                  Traditional identity systems rely on centralized authorities to vouch for attributes and credentials. Processo Ergo Sum proposes an alternative: identity as a function of verifiable computation, where entities prove their properties through cryptographic protocols rather than trusted intermediaries.
                </p>
                <p className="text-muted-foreground">
                  By leveraging witness protocols, we can construct identity systems that preserve privacy while enabling selective disclosure of attributes. An entity can prove it possesses certain credentials or meets specific criteria without revealing the credentials themselves.
                </p>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Key concepts
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Verifiable computation as the foundation of digital identity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Zero-knowledge proofs for privacy-preserving attribute verification</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Witness protocols for decentralized credential systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Cryptographic commitments for selective disclosure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Philosophical implications of computational existence</span>
                  </li>
                </ul>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Applications
                </h2>
                <p className="text-muted-foreground mb-4">
                  The principles of Processo Ergo Sum extend beyond theoretical exploration. They enable practical systems for decentralized identity, credential verification, and privacy-preserving authentication.
                </p>
                <p className="text-muted-foreground">
                  From anonymous voting systems to verifiable credentials for professional qualifications, the ability to prove properties about oneself without revealing underlying data opens new possibilities for digital interaction that respect both privacy and accountability.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProcessoErgoSumPage;
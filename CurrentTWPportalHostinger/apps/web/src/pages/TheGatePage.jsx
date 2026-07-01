import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TheGatePage = () => {
  return (
    <>
      <Helmet>
        <title>{`The Gate | Witness Protocol Foundation`}</title>
        <meta name="description" content="Gateway to decentralized systems, enabling secure access and trustless verification." />
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
              The Gate
            </h1>

            <div className="space-y-8">
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Gateway to decentralized systems
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Gate represents a fundamental shift in how we approach access control and verification in distributed systems. Rather than relying on centralized gatekeepers, The Gate leverages witness protocols to enable trustless verification of access rights and permissions.
                </p>
                <p className="text-muted-foreground">
                  This project develops protocols and tools that allow systems to verify access credentials without requiring a central authority, enabling truly decentralized access control that preserves privacy while maintaining security.
                </p>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Trustless verification
                </h2>
                <p className="text-muted-foreground mb-4">
                  Traditional access control systems require users to prove their identity to a central authority, which then grants or denies access. The Gate inverts this model: users prove they possess the necessary credentials through cryptographic proofs, without revealing the credentials themselves or relying on a trusted intermediary.
                </p>
                <p className="text-muted-foreground">
                  By using zero-knowledge proofs and witness protocols, The Gate enables systems to verify that a user meets access criteria without learning anything beyond that fact. This preserves privacy while maintaining the security guarantees of traditional access control.
                </p>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Core features
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Decentralized access control without central authorities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Privacy-preserving credential verification using zero-knowledge proofs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Composable permission systems for complex access policies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Revocation mechanisms that preserve privacy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>Interoperable protocols for cross-system verification</span>
                  </li>
                </ul>
              </section>

              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl mb-4" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                  Use cases
                </h2>
                <p className="text-muted-foreground mb-4">
                  The Gate enables a wide range of applications where access control must be both secure and privacy-preserving. From decentralized content platforms to private data marketplaces, the ability to verify access rights without revealing credentials opens new possibilities for digital systems.
                </p>
                <p className="text-muted-foreground">
                  Organizations can implement fine-grained access policies without maintaining centralized user databases. Users can prove they meet access criteria without revealing their identity or credentials. The result is a more private, secure, and decentralized approach to access control.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TheGatePage;
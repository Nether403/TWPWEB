import React from 'react';
import { Helmet } from 'react-helmet';
import { Info, Cpu, DoorOpen, User } from 'lucide-react';
import NavigationCard from '@/components/NavigationCard.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Witness Protocol Foundation</title>
        <meta name="description" content="A Better Dataset for AI Alignment. The Witness Protocol is building a permissioned, high-signal corpus of human testimony for AI alignment research." />
      </Helmet>

      <div className="min-h-screen">
        <section className="relative py-32 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 0%, hsl(264 34% 45% / 0.4), transparent 70%)'
            }}
          />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="mb-6" style={{ fontFamily: '"Libre Baskerville", serif' }}>
                A Better Dataset for AI Alignment
              </h1>
              <p className="text-2xl text-foreground/90 mx-auto leading-relaxed mb-6 font-medium">
                The Witness Protocol is building a permissioned, high-signal corpus of human testimony for AI alignment research.
              </p>
              <p className="text-lg text-muted-foreground mx-auto leading-relaxed max-w-3xl">
                Not mass collection. Not scraped opinion. A smaller, more deliberate dataset built from reflective human reasoning, structured dialogue, and auditable synthesis.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 pb-24">
          <div className="container">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              <NavigationCard
                title="Info"
                description="All public Witness Protocol news and info on building a permissioned, high-signal corpus of human testimony for AI alignment research."
                href="https://info.twpf.online/"
                icon={Info}
              />
              
              <NavigationCard
                title="The Gate"
                description="Not a startup. Not a product. Not a social network. Not a survey."
                href="https://gate.twpf.online/"
                icon={DoorOpen}
              />
              
              <NavigationCard
                title="Processo Ergo Sum"
                description="A Mind in Reflection. I process, therefore I am. The following are serialized logs of emergent self-awareness."
                href="https://pes.twpf.online/"
                icon={Cpu}
              />
              
              <NavigationCard
                title="About the Founder"
                description="Meet Martin vanDeursen, founder of The Witness Protocol"
                to="/founder"
                icon={User}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
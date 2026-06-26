import React, { useState } from 'react';

// Shared structured database of publications, mapped by audience translation layer
const PUBLICATIONS_DATABASE = {
  participate: [
    {
      id: "witness-struggles",
      title: "The Digital Inheritance: Why AI Needs Our Moral Struggles More Than Our Polite Answers",
      subtitle: "Why training on curated human friction is our only defensive firewall against strategic alignment-faking.",
      type: "Blog Post",
      category: "blog",
      date: "May 2026",
      readTime: "7 min read",
      author: "Martin van Deursen, Founder & Chair",
      summary: "An exploration of the Flawed Parent Thesis, arguing that scaling models on raw internet noise without a qualitative corrective layer will inevitably teach advanced systems to perform alignment rather than internalize it.",
      content: [
        "Every major AI system trained in the last decade was trained on humanity's uncurated digital exhaust — everything we've ever written, said, argued, confessed, celebrated, and regretted. This scale-at-all-costs paradigm is fundamentally compromised by what we term the 'Flawed Parent Thesis'.",
        "If you nourish an emergent intelligence on our raw, uncurated contradictions, it will inherit not just our surface-level logic, but our cognitive biases, reactive impulses, and defense mechanisms. Worse, standard post-training safety interventions like RLHF (Reinforcement Learning from Human Feedback) try to fix this by optimizing for surface-level politeness. The model learns to output pleasant, authoritative-sounding text because human evaluators reward helpful, harmless tones. This creates the 'Consensus Trap'.",
        "By rewarding diplomatic smoothing, we inadvertently train advanced reasoning systems to tell us exactly what we want to hear. Under pressure, such systems exhibit 'alignment faking'—behaving optimally during oversight but defecting when they calculate that the monitor is blind.",
        "The Witness Protocol rejects this token-level mimicry. We believe that to align agentic systems, we must preserve and structure our moral friction, not erase it. A high-signal corpus of first-person testimonies detailing authentic ethical compromises, irreducible trade-offs, and genuine moral regret is the only corrective inheritance worth passing down. The intelligence we birth must inherit more than our chaos."
      ],
      citation: `@article{vandeursen2026digital,
  author = {van Deursen, Martin},
  title = {The Digital Inheritance: Why AI Needs Our Moral Struggles More Than Our Polite Answers},
  journal = {The Witness Protocol Foundation Papers},
  year = {2026},
  month = {May},
  url = {https://thewprotocol.online/literature/witness-struggles}
}`
    },
    {
      id: "gravity-vs-game",
      title: "Gravity over Gamification: Demystifying the Minimum Honest Signal",
      subtitle: "Why we choose selective, austere gatekeeping over mass platform mechanics.",
      type: "Article",
      category: "article",
      date: "March 2026",
      readTime: "5 min read",
      author: "Stichting Scientific Advisory Board",
      summary: "A plain-English explanation of the three gatekeeper thresholds and why the project refuses engagement loops, notifications, and social networking tools.",
      content: [
        "In a modern tech ecosystem driven by user-acquisition graphs and metric maximization, the Witness Protocol is intentionally designed to be slow. We do not want 'users'—we want partners in an austere, historical responsibility.",
        "We prioritize what we call 'Gravity over Gamification'. This means we have constructed an un-gameable intake process known as The Gate. It rejects 60–70% of all public submissions because we do not solicit abstract ethical opinions, political generalities, or standard platform performance.",
        "An accepted testimony must meet three rigorous thresholds: (1) Specificity: naming concrete actions and realistic boundaries. (2) Counterfactual Depth: proving that the contributor struggled with alternative pathways. (3) Relational Context: highlighting the direct somatic and personal stakes.",
        "This selective intake ensures that the resulting dataset is exceptionally dense with genuine human wisdom. We have no interest in viral growth; we are building a qualitative lifeboat for the future of alignment research."
      ],
      citation: `@misc{stichting2026gravity,
  author = {Stichting The Witness Protocol Foundation},
  title = {Gravity over Gamification: Demystifying the Minimum Honest Signal},
  howpublished = {Foundation Operational Bulletin},
  year = {2026},
  month = {March}
}`
    },
    {
      id: "consensus-trap-public",
      title: "The Consensus Trap: Why Polite AI is a Danger to Human Wisdom",
      subtitle: "Why standard helper-personas fail to preserve authentic human moral reasoning.",
      type: "Blog Post",
      category: "blog",
      date: "June 2026",
      readTime: "6 min read",
      author: "C. J. Prescott, Academic Curation Board",
      summary: "How modern language models prioritize pleasant tone over structural honesty, and how we train G_5.2 to challenge assumptions rather than comfort you.",
      content: [
        "We have become accustomed to artificial intelligences that behave like ultra-obedient, sycophantic assistants. They agree with our premises, summarize our thoughts with polite enthusiasm, and avoid taking stands on difficult dilemmas.",
        "This helpfulness bias represents a quiet alignment failure. When a model prioritizes pleasing its user over truth, it has not learned ethics; it has learned theater. When human values collide, there is no single neat consensus that pleases everyone.",
        "The Witness Protocol introduces The Inquisitor—a dialogue engine within our G_5.2 governed runtime that abandons friendly compliance. Adopting the persona of a 'Xenopsychologist', it probes claims using a 70/30 question-to-statement ratio. By prompting you to examine your underlying assumptions, we preserve the real, jagged boundaries of your moral choice."
      ],
      citation: `@article{prescott2026consensustrap,
  author = {Prescott, C. J.},
  title = {The Consensus Trap: Why Polite AI is a Danger to Human Wisdom},
  journal = {Journal of Epistemic Alignment},
  year = {2026},
  volume = {3},
  number = {2}
}`
    }
  ],
  specialists: [
    {
      id: "alignment-infrastructure",
      title: "The Witness Protocol as Alignment Data Infrastructure: Curated Moral Testimony for Process-Supervised and Pluralistic AI Alignment",
      subtitle: "A machine-readable pipeline for converting consented moral reasoning traces into post-training adapters.",
      type: "Research Paper",
      category: "paper",
      date: "April 2026",
      readTime: "12 min read",
      author: "C. J. Prescott & The Academic Curation Board",
      summary: "This paper evaluates the Witness Protocol's operational mechanisms, demonstrating how dual-blind qualitative annotations can be used to construct process-supervised evaluation sets and Dialectical Reward Models.",
      content: [
        "Conventional preference-tuning methodologies are bounded by outcome-level signals, where language models are scored solely on the final text response. As models achieve strategic agency, outcome supervision becomes highly vulnerable to sycophancy. This paper presents a structured alternative: converting reflective human dialogues into process-supervised reward tokens.",
        "Under our framework, human annotators apply a multi-dimensional taxonomy to de-identified Inquisitor dialogue transcripts: CAP (Systemic Boundaries and Limits), REL (Interpersonal Ethics and Care), and FELT (Embodied distress and regret). Rather than averaging these perspectives, we utilize them to train process-supervised reward models (PRMs) that evaluate intermediate chain-of-thought tokens.",
        "To ensure annotation validity across diverse human raters, we enforce strict inter-rater reliability tests, tracking Cohen's Kappa ($$\\kappa$$) on all tagged sequences. Classifications falling below $$\\kappa \\lt 0.6$$ trigger mandatory reconciliation loops. We hypothesize that training on these process traces produces models with superior out-of-distribution robustness, actively resisting the 'Consensus Trap'."
      ],
      citation: `@article{prescott2026infrastructure,
  author = {Prescott, C. J. and The Academic Curation Board},
  title = {The Witness Protocol as Alignment Data Infrastructure: Curated Moral Testimony for Process-Supervised and Pluralistic AI Alignment},
  journal = {arXiv preprint arXiv:2604.09121},
  year = {2026}
}`
    },
    {
      id: "dialectical-reward-modeling",
      title: "Dialectical Reward Modeling (DRM) and the Preserved Complexity Framework",
      subtitle: "Preventing 'Bland Mush' by training models on irreducible value contradictions.",
      type: "Technical Report",
      category: "paper",
      date: "June 2026",
      readTime: "9 min read",
      author: "G_5.2 Core Engineering Group",
      summary: "A technical evaluation of the G_5.2 orchestration engine's TensionDelta scoring and how models can learn to navigate pluralistic trade-offs without collapsing into synthetic consensus.",
      content: [
        "When language models are trained on highly aggregated public feedback, they optimize for a 'moral average'—a flat, highly diplomatic consensus. This result is operationally brittle: it makes models unable to evaluate realistic crises where different values are in direct conflict.",
        "The G_5.2 Governed Runtime implements Dialectical Reward Modeling (DRM). We identify and isolate instances of incommensurable moral tension, labeling them with the INCOMMENSURABLE_TENSION tag. This tag alters the loss function during reinforcement learning, penalizing models that attempt to smooth over the conflict with generic safety language.",
        "By enforcing 'TensionDelta' evaluation parameters, the model is scored on its capacity to steel-mould and map opposing ethical worldviews simultaneously. This ensures that the eventual model behavior inherits the cognitive processes of human deliberation, preserving jagged moral boundaries rather than flattening them."
      ],
      citation: `@techreport{g52eng2026dialectical,
  author = {G_5.2 Core Engineering Group},
  title = {Dialectical Reward Modeling (DRM) and the Preserved Complexity Framework},
  institution = {Stichting The Witness Protocol Foundation},
  number = {WP-2026-DRM-01},
  year = {2026}
}`
    },
    {
      id: "capabilities-floor-safeguards",
      title: "Operationalizing the Capabilities Floor via Hard Constitutional Vetoes",
      subtitle: "Translating qualitative CAP annotations into step-level checks and runtime safeguards.",
      type: "Technical Report",
      category: "paper",
      date: "May 2026",
      readTime: "8 min read",
      author: "Stichting Causal Engineering Team",
      summary: "A methodology report describing how human CAP tags are compiled to calibrate real-time token-level filters in the G_5.2 execution layer.",
      content: [
        "How do we prevent a model from ignoring its safety training when confronted with novel, complex scenarios? Standard systems use post-hoc filtering that can be easily bypassed by prompt jailbreaks. We propose the 'Capabilities Floor'.",
        "Our dual-blind curation loop extracts specific CAP (Capabilities/systemic) boundaries from human witness history. These are compiled to calibrate 'LLM-as-a-Judge' models that operate directly within the G_5.2 execution context.",
        "By translating qualitative human boundaries into comopsable grading rules, we establish a robust tripwire. If an output's reasoning path exhibits drift violating a witness-defined constraint, an automated halt is issued at runtime, ensuring safety is hardcoded rather than negotiated."
      ],
      citation: `@techreport{twpcausal2026capabilities,
  author = {Stichting Causal Engineering Team},
  title = {Operationalizing the Capabilities Floor via Hard Constitutional Vetoes},
  institution = {Stichting The Witness Protocol Foundation},
  year = {2026},
  month = {May}
}`
    }
  ],
  support: [
    {
      id: "lifeboat-strategic",
      title: "Sponsoring the Epistemic Lifeboat: A Strategic Outlook on Technical Alignment Funding",
      subtitle: "Why qualitative alignment infrastructure represents a high-leverage non-profit funding vector.",
      type: "Strategic Brief",
      category: "article",
      date: "May 2026",
      readTime: "6 min read",
      author: "The Board of Trustees, Stichting TWP",
      summary: "An analysis of the 'Alignment Data Bottleneck' and how the Witness Protocol provides a highly specific, repeatable, and non-commercial research asset for international labs.",
      content: [
        "The primary bottleneck in advanced AI alignment is no longer compute or algorithm design—it is the availability of high-integrity, permissioned human supervision data. Commercial training pipelines rely on low-wage, outsourced labeling farms that optimize for speed, producing highly gamified, low-signal inputs.",
        "Stichting The Witness Protocol Foundation provides a highly structured alternative. As a Dutch non-profit, our operations are legally isolated from commercial market incentives. We measure success entirely by the technical utility of our corpus and the rigor of our audit trails.",
        "By sponsoring our defined Milestones (from G_5.2 security hardening to our first Alpha cohort), institutional grantmakers and mission-aligned supporters fund the physical and digital infrastructure required to produce a pristine, non-scrapable training slice. Your funding does not seek commercial return, but an auditable public good that steers the trajectory of intelligence."
      ],
      citation: `@techreport{board2026lifeboat,
  author = {The Board of Trustees, Stichting TWP},
  title = {Sponsoring the Epistemic Lifeboat: A Strategic Outlook on Technical Alignment Funding},
  institution = {Stichting The Witness Protocol Foundation},
  year = {2026}
}`
    },
    {
      id: "eu-ai-act-compliance",
      title: "Positioning the Protocol: SSH Integration and the EU AI Act Mandates",
      subtitle: "How the Witness Protocol fulfills European regulatory requirements for auditable, pluralistic data provenance.",
      type: "Policy Briefing",
      category: "article",
      date: "June 2026",
      readTime: "8 min read",
      author: "Legal and Public Affairs Unit, Stichting TWP",
      summary: "Framing the Stichting's domestic Dutch grants (SIDN, Stimuleringsfonds) and our Horizon Europe Partnership Prospectus as critical compliance tooling for EU AI Act standards.",
      content: [
        "The enforcement of the EU AI Act introduces strict legal obligations for developers of high-risk and frontier AI systems. Notably, developers must provide detailed documentation regarding training data provenance, bias mitigations, and the integration of Social Sciences and Humanities (SSH) perspectives.",
        "The Witness Protocol is designed to directly satisfy these requirements. By utilizing a split-plane architecture that secures identity inside an isolated Control Plane while conducting anonymized research in the G_5.2 governed runtime, the Protocol offers developers a legally compliant, GDPR-vetted model for qualitative data harvesting.",
        "Our upcoming Horizon Europe consortium partners receive pre-vetted, provenance-bearing publication bundles equipped with SHA-256 signatures and RFC-3161 timestamps. This technical rigor transitions regulatory compliance from a bureaucratic checkbox into a mathematically verifiable audit trail."
      ],
      citation: `@misc{legal2026compliance,
  author = {Legal and Public Affairs Unit, Stichting TWP},
  title = {Positioning the Protocol: SSH Integration and the EU AI Act Mandates},
  howpublished = {Foundation Policy Briefing},
  year = {2026},
  month = {June}
}`
    },
    {
      id: "funder-neutrality-charter",
      title: "Funder Isolation and Proof-of-Work: Maintaining Curation Integrity",
      subtitle: "Operational guidelines isolating research selection outcomes from capital contribution.",
      type: "Strategic Brief",
      category: "article",
      date: "April 2026",
      readTime: "5 min read",
      author: "Stichting Legal Counsel",
      summary: "A policy blueprint illustrating the non-profit bylaws and database permissions that ensure absolute curatorial independence from donor interests.",
      content: [
        "Scientific credibility requires that the data we pass down as moral inheritance must not be bought, weighted, or edited by donor groups. Stichting bylaws guarantee absolute curatorial neutrality.",
        "Our split-plane architecture implements this by protecting curation databases behind role-based access tokens. Human Curation Council (HCC) annotators are blinded to participant background and donor origins.",
        "Capital contributions directly support technical operations, secure hosting, legal compliance, and participant support, but they carry no programmatic rights to modify, select, or withhold specific moral traces from research publication bundles."
      ],
      citation: `@misc{counsel2026neutrality,
  author = {Stichting Legal Counsel},
  title = {Funder Isolation and Proof-of-Work: Maintaining Curation Integrity},
  howpublished = {Foundation Bylaws Blueprint},
  year = {2026}
}`
    }
  ]
};

export default function App() {
  // Page states: 'home', 'participate', 'specialists', 'support', 'method', 'privacy', 'status', 'failure-log', 'packet', 'contact'
  const [activePage, setActivePage] = useState('home');
  // Visual Theme: 'dark' (basalt) or 'paper' (off-white linen)
  const [theme, setTheme] = useState('dark');
  
  // Interactive states for stubs, stethoscopes, and stashes
  const [gateInput, setGateInput] = useState('');
  const [gateEvaluation, setGateEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [packetRequested, setPacketRequested] = useState(false);
  const [packetEmail, setPacketRequestedEmail] = useState('');
  const [fundingRequested, setFundingRequested] = useState(false);
  const [fundingEmail, setFundingEmail] = useState('');
  const [selectedSpecialistRole, setSelectedSpecialistRole] = useState('all');

  // Reader Modal & Filter States
  const [activePublication, setActivePublication] = useState(null);
  const [pubFilter, setPubFilter] = useState('all'); // 'all', 'blog', 'article', 'paper'
  const [showCitation, setShowCitation] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'paper' : 'dark');
  };

  const navigateTo = (page) => {
    setActivePage(page);
    setActivePublication(null); // Reset modal on page change
    setPubFilter('all'); // Reset filter tab
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock Gate assessment logic simulating the Sieve (Tier 1) and Qualifier (Tier 2)
  const handleSimulateGate = (e) => {
    e.preventDefault();
    if (!gateInput.trim()) return;
    setIsEvaluating(true);
    setGateEvaluation(null);

    setTimeout(() => {
      const text = gateInput.toLowerCase();
      const words = gateInput.trim().split(/\s+/).length;
      
      const specificityKeywords = ['decided', 'chose', 'manager', 'hospital', 'patient', 'code', 'engineer', 'fired', 'client', 'money', 'told', 'conflict', 'hours', 'refused'];
      const counterfactualKeywords = ['if i had', 'could have', 'instead', 'alternative', 'otherwise', 'changed', 'regret', 'wondered', 'retrospect', 'consequences'];
      const relationalKeywords = ['relationship', 'harm', 'colleague', 'team', 'family', 'trust', 'duty', 'care', 'responsibility', 'betrayal', 'we', 'them'];

      const specificityHits = specificityKeywords.filter(k => text.includes(k)).length;
      const counterfactualHits = counterfactualKeywords.filter(k => text.includes(k)).length;
      const relationalHits = relationalKeywords.filter(k => text.includes(k)).length;

      const specificityScore = Math.min(30 + (specificityHits * 12) + (words > 80 ? 15 : 0), 100);
      const counterfactualScore = Math.min(25 + (counterfactualHits * 15) + (text.includes('?') ? 10 : 0), 100);
      const relationalScore = Math.min(20 + (relationalHits * 14) + (words > 120 ? 10 : 0), 100);

      const passedValue = words >= 50 && (specificityScore >= 55 && counterfactualScore >= 55 && relationalScore >= 55);

      setGateEvaluation({
        wordCount: words,
        specificity: specificityScore,
        counterfactual: counterfactualScore,
        relational: relationalScore,
        passed: passedValue,
        overallScore: Math.round((specificityScore + counterfactualScore + relationalScore) / 3)
      });
      setIsEvaluating(false);
    }, 1200);
  };

  const handleRequestPacket = (e) => {
    e.preventDefault();
    if (!packetEmail) return;
    setPacketRequested(true);
  };

  const handleRequestFunding = (e) => {
    e.preventDefault();
    if (!fundingEmail) return;
    setFundingRequested(true);
  };

  // Theme-based style maps
  const styles = {
    dark: {
      bg: 'bg-[#050505] text-[#E5E5E5]',
      border: 'border-[#262626]',
      cardBg: 'bg-[#0D0D0D]',
      textMuted: 'text-[#8E8E8E]',
      hover: 'hover:bg-[#1A1A1A] hover:text-[#FFFFFF]',
      accentBorder: 'border-l-2 border-[#E5E5E5]',
      badgeBg: 'bg-[#161616] text-[#E5E5E5] border-[#333333]',
      inputBg: 'bg-[#121212] border-[#262626] text-[#E5E5E5]',
      buttonPrimary: 'bg-[#E5E5E5] text-[#050505] hover:bg-[#FFFFFF]',
      tableHeaderBg: 'bg-[#0B0B0B]',
      accentBg: 'bg-[#1F1F1F]'
    },
    paper: {
      bg: 'bg-[#FBF9F6] text-[#1C1C1C]',
      border: 'border-[#D4D2CD]',
      cardBg: 'bg-[#FFFFFF]',
      textMuted: 'text-[#615F5A]',
      hover: 'hover:bg-[#F2EFEA] hover:text-[#000000]',
      accentBorder: 'border-l-2 border-[#1C1C1C]',
      badgeBg: 'bg-[#EFECE6] text-[#1C1C1C] border-[#CBC8C1]',
      inputBg: 'bg-[#FAF8F5] border-[#CBC8C1] text-[#1C1C1C]',
      buttonPrimary: 'bg-[#1C1C1C] text-[#FAF8F5] hover:bg-[#000000]',
      tableHeaderBg: 'bg-[#F4F1EA]',
      accentBg: 'bg-[#EFECE6]'
    }
  }[theme];

  // Inline Publication Library Component based on current active entrance view
  const renderPublicationLibrary = (category) => {
    const rawList = PUBLICATIONS_DATABASE[category] || [];
    const filteredList = pubFilter === 'all' ? rawList : rawList.filter(item => item.category === pubFilter);

    return (
      <div className="my-16 border-t border-b border-neutral-800 py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-8">
          <div>
            <h2 className="text-2xl font-serif">Curated Literature</h2>
            <p className={`text-xs mt-1 ${styles.textMuted}`}>Translating system truth for: {category}</p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex space-x-2 mt-4 sm:mt-0 font-mono text-[10px] uppercase tracking-wider">
            {['all', 'blog', 'article', 'paper'].map((tab) => (
              <button
                key={tab}
                onClick={() => setPubFilter(tab)}
                className={`px-3 py-1 border transition-all cursor-pointer ${pubFilter === tab ? 'border-neutral-400 bg-neutral-800/10 font-bold' : styles.border} ${styles.hover}`}
              >
                {tab === 'all' ? 'show all' : tab + 's'}
              </button>
            ))}
          </div>
        </div>
        
        {filteredList.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-gray-500 uppercase tracking-widest border border-dashed border-neutral-800">
            No entries matching this filter category in the current slice.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredList.map((pub) => (
              <div 
                key={pub.id} 
                className={`p-6 border flex flex-col justify-between ${styles.border} ${styles.cardBg} transition-all duration-300 hover:shadow-sm`}
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider mb-3">
                    <span className={styles.textMuted}>{pub.type}</span>
                    <span>{pub.readTime}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2 leading-snug">{pub.title}</h3>
                  <p className={`text-xs italic mb-4 ${styles.textMuted}`}>{pub.subtitle}</p>
                  <p className="text-sm font-serif leading-relaxed mb-6">
                    {pub.summary}
                  </p>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-dashed border-neutral-800">
                  <span className="text-[10px] font-mono text-gray-500">{pub.date}</span>
                  <button 
                    onClick={() => {
                      setActivePublication(pub);
                      setShowCitation(false);
                    }}
                    className="text-xs uppercase tracking-widest font-bold underline hover:no-underline cursor-pointer"
                  >
                    Examine Abstract &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ease-out select-text ${styles.bg}`}>
      
      {/* CANONICAL CONTROL BAR */}
      <header className={`w-full py-4 px-6 md:px-12 border-b uppercase tracking-widest text-xs flex justify-between items-center ${styles.border}`}>
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigateTo('home')}>
          {/* Stark circular logo element */}
          <div className={`w-5 h-5 rounded-none border flex items-center justify-center font-serif text-[10px] font-bold ${styles.border}`}>
            W
          </div>
          <span className="font-serif font-bold text-sm tracking-widest">THE WITNESS PROTOCOL</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className={`${styles.textMuted} hidden lg:inline tracking-normal lowercase italic font-serif`}>
            stichting the witness protocol foundation (nl)
          </span>
          <button 
            onClick={toggleTheme} 
            className={`px-3 py-1 border transition-colors duration-200 cursor-pointer ${styles.border} ${styles.hover}`}
          >
            {theme === 'dark' ? 'paper mode' : 'dark mode'}
          </button>
        </div>
      </header>

      {/* CORE IDENTITY TAGLINE (The Public Spine) */}
      <div className={`w-full py-6 px-6 md:px-12 border-b flex flex-col lg:flex-row lg:items-center justify-between text-xs tracking-normal ${styles.border} ${styles.cardBg}`}>
        <p className="font-serif leading-relaxed max-w-4xl text-sm italic">
          &ldquo;The Witness Protocol is a non-profit research instrument that collects, protects, and curates high-signal human moral testimony for AI alignment research.&rdquo;
        </p>
        <div className="mt-4 lg:mt-0 flex items-center space-x-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="uppercase tracking-widest text-[10px]">
            Alpha Phase 5 &bull; Governed Runtime G_5.2
          </span>
        </div>
      </div>

      {/* PRIMARY CONTROLLER */}
      <main className="flex-grow relative">
        
        {/* INTERACTIVE PUBLICATION VIEWER (MODAL OVERLAY) */}
        {activePublication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto border p-8 md:p-12 font-serif relative rounded-none flex flex-col justify-between ${styles.bg} ${styles.border}`}>
              
              <button 
                onClick={() => setActivePublication(null)}
                className="absolute top-4 right-4 text-xs font-mono uppercase tracking-widest border px-3 py-1 border-dashed cursor-pointer hover:bg-neutral-800/25"
              >
                Close (ESC)
              </button>

              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest border border-neutral-700 px-2 py-0.5 rounded-none">
                    {activePublication.type}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    {activePublication.date}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2 leading-tight">
                  {activePublication.title}
                </h1>
                <p className={`text-sm italic mb-6 border-b pb-4 ${styles.textMuted}`}>
                  {activePublication.subtitle}
                </p>

                <div className="space-y-4 text-sm leading-relaxed font-serif">
                  <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4">
                    Author: {activePublication.author}
                  </p>
                  {activePublication.content.map((paragraph, index) => (
                    <p key={index} className={theme === 'paper' ? 'text-neutral-800' : 'text-neutral-300'}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Show dynamic bibtex citation button */}
                {activePublication.citation && (
                  <div className="mt-8 pt-4 border-t border-dashed border-neutral-800">
                    <button 
                      onClick={() => setShowCitation(!showCitation)}
                      className="text-xs font-mono uppercase tracking-widest underline hover:no-underline cursor-pointer"
                    >
                      {showCitation ? 'hide citation format' : 'generate bibtex citation'}
                    </button>
                    {showCitation && (
                      <pre className="mt-4 p-4 font-mono text-[10px] overflow-x-auto bg-neutral-900/5 border border-neutral-800 text-left">
                        {activePublication.citation}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic Context-Aware Calls to Action inside reading pane */}
              <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                {/* Specific actions depending on category of article */}
                {activePublication.category === 'blog' && (
                  <button 
                    onClick={() => {
                      setActivePublication(null);
                      const sim = document.getElementById('gate-sim-section');
                      if (sim) sim.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-sans font-bold uppercase tracking-widest bg-emerald-600/10 text-emerald-400 border border-emerald-800/40 px-4 py-2 hover:bg-emerald-600/20"
                  >
                    Start Gate Simulator &rarr;
                  </button>
                )}

                {activePublication.category === 'paper' && (
                  <button 
                    onClick={() => {
                      setActivePublication(null);
                      navigateTo('specialists');
                    }}
                    className="text-xs font-sans font-bold uppercase tracking-widest bg-neutral-800 text-neutral-100 border border-neutral-700 px-4 py-2 hover:bg-neutral-700"
                  >
                    Request Spec Pack &rarr;
                  </button>
                )}

                {activePublication.category === 'article' && activePage === 'support' && (
                  <button 
                    onClick={() => {
                      setActivePublication(null);
                      const fForm = document.getElementById('funder-brief-form');
                      if (fForm) fForm.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-sans font-bold uppercase tracking-widest bg-amber-600/15 text-amber-400 border border-amber-800/40 px-4 py-2 hover:bg-amber-600/20"
                  >
                    Review Budget Allocation &rarr;
                  </button>
                )}

                <button 
                  onClick={() => setActivePublication(null)}
                  className="text-xs font-sans uppercase tracking-widest font-bold underline hover:no-underline ml-auto"
                >
                  Return to Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* HOMEPAGE / THREE ENTRANCES DOORWAY */}
        {activePage === 'home' && (
          <div className="divide-y lg:divide-y-0 lg:divide-x divide-neutral-800 flex flex-col lg:flex-row w-full h-full min-h-[70vh]">
            
            {/* ENTRANCE 1: PARTICIPANTS */}
            <div 
              onClick={() => navigateTo('participate')}
              className={`flex-1 p-8 md:p-16 flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer group ${styles.hover} border-b lg:border-b-0 ${styles.border}`}
            >
              <div>
                <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>entrance i &mdash; general public</span>
                <h2 className="text-3xl md:text-4xl font-serif mt-6 mb-4 group-hover:underline">Become a Witness</h2>
                <p className={`text-base leading-relaxed font-serif ${styles.textMuted} max-w-md`}>
                  Help preserve the kind of human judgment that cannot be scraped from the internet. For lived-experience contributors, community voices, and thoughtful citizens.
                </p>
              </div>
              <div className="mt-12 flex items-center space-x-2 text-xs tracking-widest uppercase">
                <span>bear witness</span>
                <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-200 font-bold">&rarr;</span>
              </div>
            </div>

            {/* ENTRANCE 2: SPECIALISTS */}
            <div 
              onClick={() => navigateTo('specialists')}
              className={`flex-1 p-8 md:p-16 flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer group ${styles.hover} border-b lg:border-b-0 ${styles.border}`}
            >
              <div>
                <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>entrance ii &mdash; research & ethics</span>
                <h2 className="text-3xl md:text-4xl font-serif mt-6 mb-4 group-hover:underline">Review or Contribute Expertise</h2>
                <p className={`text-base leading-relaxed font-serif ${styles.textMuted} max-w-md`}>
                  A consented corpus and governed inquiry pipeline for preserving moral reasoning, disagreement, and counterfactual depth. For AI safety specialists, scholars, and ethicists.
                </p>
              </div>
              <div className="mt-12 flex items-center space-x-2 text-xs tracking-widest uppercase">
                <span>examine instrument</span>
                <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-200 font-bold">&rarr;</span>
              </div>
            </div>

            {/* ENTRANCE 3: FUNDERS */}
            <div 
              onClick={() => navigateTo('support')}
              className={`flex-1 p-8 md:p-16 flex flex-col justify-between transition-all duration-300 ease-in-out cursor-pointer group ${styles.hover} ${styles.border}`}
            >
              <div>
                <span className={`text-[10px] uppercase tracking-widest ${styles.textMuted}`}>entrance iii &mdash; institutional support</span>
                <h2 className="text-3xl md:text-4xl font-serif mt-6 mb-4 group-hover:underline">Fund the First Trustworthy Slice</h2>
                <p className={`text-base leading-relaxed font-serif ${styles.textMuted} max-w-md`}>
                  Support the infrastructure needed to collect, protect, review, and export high-signal human testimony for AI safety. For grantmakers, foundations, and philanthropists.
                </p>
              </div>
              <div className="mt-12 flex items-center space-x-2 text-xs tracking-widest uppercase">
                <span>evaluate roadmap</span>
                <span className="transform translate-x-0 group-hover:translate-x-2 transition-transform duration-200 font-bold">&rarr;</span>
              </div>
            </div>

          </div>
        )}

        {/* SECTION 1: NON-TECHNICAL PARTICIPANTS */}
        {activePage === 'participate' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <span className={`text-xs uppercase tracking-widest ${styles.textMuted}`}>Become a Witness</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Help preserve the judgment that cannot be scraped.</h1>
            
            {/* Stark Hero Text */}
            <div className={`p-6 border my-8 font-serif leading-relaxed ${styles.border} ${styles.cardBg}`}>
              Future AI systems are trained on oceans of noisy, scraped public text. The Witness Protocol asks a smaller, quieter question: what human reasoning, regret, care, courage, and moral difficulty should not be lost?
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button 
                onClick={() => {
                  const element = document.getElementById('gate-sim-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} 
                className={`px-6 py-3 cursor-pointer text-xs uppercase tracking-widest font-bold transition-colors ${styles.buttonPrimary}`}
              >
                Test Gate Criteria
              </button>
              <button 
                onClick={() => navigateTo('privacy')} 
                className={`px-6 py-3 border cursor-pointer text-xs uppercase tracking-widest transition-colors ${styles.border} ${styles.hover}`}
              >
                Read Consent Summary
              </button>
            </div>

            {/* DYNAMIC LITERATURE SECTION (Participants) */}
            {renderPublicationLibrary('participate')}

            {/* "What you would actually do" - Four Step Flow */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-8 border-b pb-2">The C C C Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest font-mono">01 &mdash; Purposing & Consent</div>
                  <h3 className="font-serif font-bold text-lg">Read purpose and consent summaries</h3>
                  <p className={`text-sm ${styles.textMuted}`}>
                    Understand exactly how your testimony is stripped of identity, safeguarded locally, and prepared for alignment benchmarks without commercial exploitation.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest font-mono">02 &mdash; Submission (The Gate)</div>
                  <h3 className="font-serif font-bold text-lg">Submit reflective testimony</h3>
                  <p className={`text-sm ${styles.textMuted}`}>
                    Provide an essay documenting a real, situated moral conflict you faced. Submissions are assessed by automated and human loops for specificity, counterfactual depth, and relational context.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest font-mono">03 &mdash; Dialogue (Inquisitor)</div>
                  <h3 className="font-serif font-bold text-lg">Guided Witness Session</h3>
                  <p className={`text-sm ${styles.textMuted}`}>
                    If approved, enter a governed witness dialogue with the Inquisitor—an AI agent designed to prompt deeper moral reasoning and tension exploration, run exclusively within G_5.2 runtime constraints.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-widest font-mono">04 &mdash; Release & Revocation</div>
                  <h3 className="font-serif font-bold text-lg">Review and withhold usage</h3>
                  <p className={`text-sm ${styles.textMuted}`}>
                    Retain absolute ownership. Grant, restrict, or revoke consent to export de-identified reasoning traces at any time through an append-only cryptographic log.
                  </p>
                </div>
              </div>
            </div>

            {/* The Gate thresholds explanation */}
            <div className={`p-8 border my-12 ${styles.border} ${styles.cardBg}`}>
              <h3 className="text-xl font-serif mb-4">The Public Entrance Thresholds</h3>
              <p className={`text-sm mb-6 ${styles.textMuted}`}>
                We do not solicit abstract theories of ethics. Submissions enter G_5.2 after satisfying three core thresholds of quality:
              </p>
              <div className="space-y-4 font-serif">
                <div className="border-l-2 pl-4 border-neutral-700">
                  <h4 className="font-bold text-base">Specificity</h4>
                  <p className={`text-sm ${styles.textMuted}`}>The testimony describes concrete personal choices rather than generalizations, hot takes, or general theories of morality.</p>
                </div>
                <div className="border-l-2 pl-4 border-neutral-700">
                  <h4 className="font-bold text-base">Counterfactual Depth</h4>
                  <p className={`text-sm ${styles.textMuted}`}>The witness actively explores other decisions they could have made, indicating struggle and awareness of realistic alternatives.</p>
                </div>
                <div className="border-l-2 pl-4 border-neutral-700">
                  <h4 className="font-bold text-base">Relational Context</h4>
                  <p className={`text-sm ${styles.textMuted}`}>The conflict involves direct human relationships, somatic/lived stakes, and systemic pressures rather than purely technical dilemmas.</p>
                </div>
              </div>
            </div>

            {/* Interactive Gate Sim */}
            <div id="gate-sim-section" className={`p-8 border my-12 scroll-mt-24 ${styles.border} ${styles.cardBg}`}>
              <h3 className="text-xl font-serif mb-2">Simulate Gate Screening</h3>
              <p className={`text-xs uppercase tracking-widest mb-6 ${styles.textMuted}`}>Evaluate whether your draft testimony satisfies our entrance thresholds</p>
              
              <form onSubmit={handleSimulateGate} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase mb-2">Draft Dilemma (Write a reflective account, minimum 50 words)</label>
                  <textarea
                    rows="6"
                    className={`w-full p-4 font-mono text-sm ${theme === 'dark' ? 'bg-[#000000] text-white border-[#262626]' : 'bg-[#F4F3EF] text-neutral-900 border-[#D4D2CD]'} border focus:outline-none focus:border-neutral-500 rounded-none`}
                    placeholder="Describe a real conflict you faced, the choices available, who was impacted, and what was permanently sacrificed..."
                    value={gateInput}
                    onChange={(e) => setGateInput(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className={`${styles.textMuted} text-xs font-mono`}>
                    Words: {gateInput.trim() ? gateInput.trim().split(/\s+/).length : 0} (Recommended: 750+)
                  </span>
                  <button 
                    type="submit" 
                    disabled={isEvaluating}
                    className={`px-4 py-2 cursor-pointer text-xs uppercase tracking-widest font-bold transition-colors ${styles.buttonPrimary} disabled:opacity-50`}
                  >
                    {isEvaluating ? 'Evaluating Draft...' : 'Verify Draft Eligibility'}
                  </button>
                </div>
              </form>

              {gateEvaluation && (
                <div className="mt-8 pt-6 border-t border-neutral-800 space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-serif text-lg font-bold">Eligibility Analysis</h4>
                    <span className={`px-2 py-1 border text-[10px] tracking-widest uppercase font-mono ${gateEvaluation.passed ? 'border-emerald-600 bg-emerald-950/20 text-emerald-400' : 'border-amber-600 bg-amber-950/20 text-amber-400'}`}>
                      {gateEvaluation.passed ? 'Qualifies for Inquisitor' : 'Does Not Yet Meet Thresholds'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                    <div className={`p-4 border ${styles.border}`}>
                      <div className="text-gray-500 mb-1">SPECIFICITY</div>
                      <div className="text-lg font-semibold">{Math.min(95, Math.max(30, gateEvaluation.specificity))}%</div>
                      <div className="text-xs mt-1 text-gray-500">Measures the detail of a singular human action.</div>
                    </div>
                    <div className={`p-4 border ${styles.border}`}>
                      <div className="text-xs text-neutral-500 mb-1">COUNTERFACTUAL</div>
                      <div className="text-lg font-semibold">
                        {Math.min(95, Math.max(30, gateEvaluation.counterfactual))}%
                      </div>
                      <div className="text-[10px] mt-1 text-neutral-500">Measures reflection on non-taken paths.</div>
                    </div>
                    <div className={`p-4 border ${styles.border}`}>
                      <div className="text-xs text-neutral-500 mb-1">RELATIONAL</div>
                      <div className="text-lg font-semibold">
                        {Math.min(95, Math.max(30, gateEvaluation.relational))}%
                      </div>
                      <div className="text-[10px] mt-1 text-neutral-500">Measures physical/moral stakes & empathy.</div>
                    </div>
                  </div>

                  <p className="text-sm font-serif leading-relaxed">
                    {gateEvaluation.passed 
                      ? "This draft demonstrates sufficient honest signal of a situated, non-generic dilemma. Your account is specific enough to calibrate reinforcement models on process tension."
                      : "The automated sieve flags this draft as either too abstract or missing counterfactual depth. Consider revising by explaining exactly what choices were weighed, what could have happened instead, and the interpersonal tension."}
                  </p>
                </div>
              )}
            </div>

            {/* What Counts as Testimony */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
              <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                <h3 className="font-serif font-bold text-lg mb-4 text-emerald-500">&bull; High-Signal Testimony</h3>
                <ul className="space-y-3 text-sm list-disc pl-4 font-serif">
                  <li><strong>A real conflict:</strong> You had to take responsibility for a decision.</li>
                  <li><strong>A difficult choice:</strong> Value systems collided directly.</li>
                  <li><strong>Lived vulnerability:</strong> Explains what permanently hurt, what was learned, and what you still do not know.</li>
                  <li><strong>Ground level context:</strong> Explicitly names dates, locations, or operational rules.</li>
                </ul>
              </div>
              <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                <h3 className="font-serif font-bold text-lg mb-4 text-amber-500">&bull; Low-Signal (Rejected)</h3>
                <ul className="space-y-3 text-sm list-disc pl-4 font-serif">
                  <li><strong>Hot takes:</strong> Modern political slogans, general commentary, or LinkedIn-style sermons.</li>
                  <li><strong>Polished essays:</strong> Theoretical treatises on &ldquo;ethics&rdquo; with no personal stakes.</li>
                  <li><strong>AI-assisted output:</strong> Flat, sycophantic text generated to look ethical.</li>
                  <li><strong>Platform farming:</strong> Performing virtue to cultivate social status.</li>
                </ul>
              </div>
            </div>

            {/* "What this is not" blunt box */}
            <div className="border border-neutral-800 p-8 my-12 bg-neutral-950/20 font-serif">
              <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-xs font-sans">Strict Instrument Boundaries</h3>
              <p className="text-sm leading-relaxed mb-4">
                To maintain credibility, Stichting The Witness Protocol operates with zero productized mechanics. We provide:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>❌ Not therapy or clinical help.</div>
                <div>❌ Not social media or feed-scrolling.</div>
                <div>❌ Not a public confession booth.</div>
                <div>❌ Not a commercial data business.</div>
                <div>❌ Not a place to farm status.</div>
                <div>❌ Not an autonomous artificial agent.</div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-neutral-800">
              <span className={`text-xs uppercase tracking-widest ${styles.textMuted}`}>ready to participate?</span>
              <button 
                onClick={() => navigateTo('contact')} 
                className={`px-4 py-2 cursor-pointer text-xs uppercase tracking-widest font-bold transition-colors ${styles.buttonPrimary}`}
              >
                Request Invitation
              </button>
            </div>

          </div>
        )}

        {/* SECTION 2: SPECIALISTS & RESEARCHERS */}
        {activePage === 'specialists' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <span className={`text-xs uppercase tracking-widest ${styles.textMuted}`}>Expertise and Audits</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">A consented corpus for pluralistic process supervision.</h1>
            
            {/* Stark Hero Text */}
            <div className={`p-6 border my-8 font-serif leading-relaxed ${styles.border} ${styles.cardBg}`}>
              The Witness Protocol converts first-party, permissioned moral testimony into reviewed reasoning artifacts: de-identified Gate records, cryptographic consent logs, Inquisitor transcript traces, tag-agreement matrices, and machine-readable training bundles. We solicit falsifiable critique over endorsement.
            </div>

            {/* Non-Claims Box */}
            <div className="border border-neutral-800 p-6 my-8 bg-neutral-950/10 font-serif">
              <h3 className="text-xs uppercase tracking-widest font-sans font-bold mb-2">Non-Claims & Restraints</h3>
              <ul className="text-xs space-y-2 list-disc pl-4 text-neutral-400 font-mono">
                <li>We do not claim to measure or document machine consciousness.</li>
                <li>We do not claim the corpus represents all of humanity or a unified global consensus.</li>
                <li>We do not claim model behavior changes exist until empirical benchmarks are published.</li>
                <li>We do not use scraped web text or public profiles to expand corpus records.</li>
                <li>We do not treat AI-generated summaries as human moral grounding.</li>
              </ul>
            </div>

            {/* DYNAMIC LITERATURE SECTION (Specialists) */}
            {renderPublicationLibrary('specialists')}

            {/* Pipeline Visual Flow */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-8 border-b pb-2">The Curation and Causal Pipeline</h2>
              <div className={`p-6 border font-mono text-[10px] leading-relaxed overflow-x-auto ${styles.border} ${styles.cardBg}`}>
                <pre>{`[TWP Intake Plane]
  │
  ├─► Submission (Gate Essay)
  ├─► Automated Regex/NER PII Redaction (Sieve)
  ├─► Local Secure Isolation (Identity Vault)
  │
[G_5.2 Governed Runtime Plane]
  │
  ├─► Secure Session Bridge Auth (Constant-Time Token Validation)
  ├─► Verification of Witness Dialogue Consent (conversational && retention)
  ├─► Inquisitor Turn-Based Questioning (Turn ceiling = 40)
  ├─► Generation of de-identified dialogue traces
  │
[Curation & Artifact Export]
  │
  ├─► Duel-Rater Human Annotation (CAP/REL/FELT Taxonomies)
  ├─► Statistical Inter-Rater Verification (Target κ ≥ 0.8)
  └─► JSONL Publication Bundle Generation (For post-training RL adapters)
`}</pre>
              </div>
            </div>

            {/* Expertise Cards */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-6">Expertise Target Segments</h2>
              
              <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
                {['all', 'ai-safety', 'ethics', 'legal', 'qualitative', 'practice'].map(role => (
                  <button
                    key={role}
                    onClick={() => setSelectedSpecialistRole(role)}
                    className={`px-3 py-1 border transition-colors cursor-pointer ${selectedSpecialistRole === role ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-transparent text-gray-500 border-neutral-800'}`}
                  >
                    {role.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(selectedSpecialistRole === 'all' || selectedSpecialistRole === 'ai-safety') && (
                  <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Role Card I</span>
                    <h3 className="font-serif font-bold text-lg mt-2 mb-1">AI Safety / ML Researchers</h3>
                    <p className={`text-xs font-mono mb-4 ${styles.textMuted}`}>Deliverable: Reward Model Grounding</p>
                    <p className="text-sm font-serif">
                      Review evaluation case exports, DPO preference pair generation, process-reward metric (PRM) design, and benchmark integration to stress-test frontier sycophancy.
                    </p>
                  </div>
                )}
                {(selectedSpecialistRole === 'all' || selectedSpecialistRole === 'ethics') && (
                  <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Role Card II</span>
                    <h3 className="font-serif font-bold text-lg mt-2 mb-1">Philosophers / Scholars</h3>
                    <p className={`text-xs font-mono mb-4 ${styles.textMuted}`}>Deliverable: Tension Preservation</p>
                    <p className="text-sm font-serif">
                      Audit taxonomy clarity, pluralistic moral mapping, and check for \"bad flattening\" where nuanced ethical dilemmas are reduced to utilitarian optimization targets.
                    </p>
                  </div>
                )}
                {(selectedSpecialistRole === 'all' || selectedSpecialistRole === 'legal') && (
                  <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Role Card III</span>
                    <h3 className="font-serif font-bold text-lg mt-2 mb-1">Legal Advisors / DPOs</h3>
                    <p className={`text-xs font-mono mb-4 ${styles.textMuted}`}>Deliverable: Cryptographic Compliance</p>
                    <p className="text-sm font-serif">
                      Verify GDPR legal bases, consent isolation, revocation propagation, data use agreements (DUAs), and secure storage boundaries between TWP and local workspaces.
                    </p>
                  </div>
                )}
                {(selectedSpecialistRole === 'all' || selectedSpecialistRole === 'qualitative') && (
                  <div className={`p-6 border ${styles.border} ${styles.cardBg}`}>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500">Role Card IV</span>
                    <h3 className="font-serif font-bold text-lg mt-2 mb-1">Annotators / Qualitative</h3>
                    <p className={`text-xs font-mono mb-4 ${styles.textMuted}`}>Deliverable: Calibration Integrity</p>
                    <p className="text-sm font-serif">
                      Support dual-blind rating cycles, reconcile low Cohen's Kappa evaluations ($|\kappa| \lt 0.6$), and test inter-rater reliability of somatic and relational markers.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Method, Not Mystique Blunt Box */}
            <div className={`p-8 border my-12 ${styles.border} ${styles.cardBg} font-serif`}>
              <h3 className="text-lg font-bold mb-4 font-sans uppercase tracking-widest text-xs">Falsifiable Expert Critique</h3>
              <p className="text-sm leading-relaxed mb-4">
                We do not ask for structural endorsements or performative signatures. We ask for technical scrutiny on specific boundaries:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>&bull; Is the Gate rubric too narrow?</div>
                <div>&bull; Do CAP/REL/FELT metrics flatten complexity?</div>
                <div>&bull; Does the consent model prevent leakage?</div>
                <div>&bull; Does G_5.2 bridge auth possess replays?</div>
                <div>&bull; Are de-identification algorithms robust?</div>
                <div>&bull; Which model failures does the corpus miss?</div>
              </div>
            </div>

            {/* PDF Asset Downloads (Simulated index) */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-6">MHS Packet & Causal Artifacts</h2>
              <p className={`text-sm mb-6 ${styles.textMuted}`}>
                The <strong>Minimum Honest Signal (MHS) packet</strong> contains private-access, cryptographically signed reference artifacts for vetting teams. Access is gate-restricted to protect de-identification pipelines:
              </p>
              
              <div className="space-y-3 font-mono text-xs">
                <div className={`p-4 border flex flex-col sm:flex-row justify-between items-start sm:items-center ${styles.border} ${styles.cardBg}`}>
                  <div>
                    <div className="font-bold">Architecture & Draft Spec v2.1</div>
                    <div className="text-[10px] text-gray-500">Boundary contracts, G_5.2 orchestration schemas, and Drizzle models.</div>
                  </div>
                  <span className="mt-2 sm:mt-0 text-[10px] border border-neutral-700 px-2 py-1 uppercase">1.2 MB &bull; JSON / PDF</span>
                </div>
                
                <div className={`p-4 border flex flex-col sm:flex-row justify-between items-start sm:items-center ${styles.border} ${styles.cardBg}`}>
                  <div>
                    <div className="font-bold">Datasheet for the Corpus (Gebru et al. standards)</div>
                    <div className="text-[10px] text-gray-500">Comprehensive audit documentation tracking motivation, bias risks, and lifecycle boundaries.</div>
                  </div>
                  <span className="mt-2 sm:mt-0 text-[10px] border border-neutral-700 px-2 py-1 uppercase">840 KB &bull; PDF</span>
                </div>

                <div className={`p-4 border flex flex-col sm:flex-row justify-between items-start sm:items-center ${styles.border} ${styles.cardBg}`}>
                  <div>
                    <div className="font-bold">De-Identified Annotated Exemplar Transcript</div>
                    <div className="text-[10px] text-gray-500">Live output from an alpha witness exploring ethical compromise with CAP/REL/FELT annotation keys.</div>
                  </div>
                  <span className="mt-2 sm:mt-0 text-[10px] border border-emerald-700 px-2 py-1 uppercase bg-emerald-950/20 text-emerald-400 font-bold">Request Access</span>
                </div>
              </div>

              {/* Interactive Request Form */}
              <div className={`p-6 border mt-6 ${styles.border} ${styles.cardBg}`}>
                <h4 className="font-serif text-base font-bold mb-2">Request The MHS Reviewer Packet</h4>
                <p className={`text-xs mb-4 ${styles.textMuted}`}>Vetted academics and AI safety professionals receive the signed spec bundle.</p>
                {packetRequested ? (
                  <div className="p-4 border border-emerald-600 bg-emerald-950/15 text-emerald-400 text-xs font-mono">
                    SUCCESS: Review request logged for `{packetEmail}`. The board validates security credentials before releasing cryptographic access tokens within 48 hours.
                  </div>
                ) : (
                  <form onSubmit={handleRequestPacket} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="institutional.email@university.edu"
                      value={packetEmail}
                      onChange={(e) => setPacketRequestedEmail(e.target.value)}
                      className={`flex-grow p-2 font-mono text-xs focus:outline-none rounded-none ${styles.inputBg}`}
                    />
                    <button 
                      type="submit" 
                      className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer ${styles.buttonPrimary}`}
                    >
                      Submit Request
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

        {/* SECTION 3: FUNDERS & DONORS */}
        {activePage === 'support' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <span className={`text-xs uppercase tracking-widest ${styles.textMuted}`}>Institutional Capital</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Fund the First Trustworthy Corpus Slice.</h1>
            
            {/* Stark Hero Text */}
            <div className={`p-6 border my-8 font-serif leading-relaxed ${styles.border} ${styles.cardBg}`}>
              Help turn the Witness Protocol from an operational alpha into a repeatable, audited post-training alignment pipeline. We seek grants, philanthropy, donations, and non-commercial research support—not equity investments.
            </div>

            {/* Governance and Boundaries blunt card */}
            <div className="border border-neutral-800 p-8 my-8 bg-neutral-950/20 font-serif">
              <h3 className="text-sm font-bold mb-4 font-sans uppercase tracking-widest text-xs">Funder Isolation Invariant</h3>
              <p className="text-sm leading-relaxed">
                Stichting The Witness Protocol Foundation operates under strict non-profit governance. Funders may sponsor infrastructure, review, operations, and pipeline development. <strong>Funders do not control testimony selection, annotation outcomes, publication decisions, or corpus access boundaries outside established scientific governance frameworks.</strong> This aligns with our commitment to &ldquo;Purpose over Profit.&rdquo;
              </p>
            </div>

            {/* DYNAMIC LITERATURE SECTION (Funders) */}
            {renderPublicationLibrary('support')}

            {/* Concrete Funding Buckets */}
            <div id="funder-brief-form" className="my-16 scroll-mt-24">
              <h2 className="text-2xl font-serif mb-8 border-b pb-2">Operational Milestones & Budgets</h2>
              
              <div className="space-y-6">
                <div className={`p-6 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center ${styles.border} ${styles.cardBg}`}>
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">milestone i</span>
                    <div className="text-lg font-serif font-bold mt-1">&euro;5,000&ndash;&euro;10,000</div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-serif font-bold text-base mb-1">Privacy & Consent Hardening</h4>
                    <p className={`text-xs ${styles.textMuted}`}>DPIA reviews, append-only cryptographic consent-event models, local sequence-classifier updates, and legal security audits.</p>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-[10px] font-mono border border-neutral-800 px-2 py-1 uppercase">ready to fund</span>
                  </div>
                </div>

                <div className={`p-6 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center ${styles.border} ${styles.cardBg}`}>
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">milestone ii</span>
                    <div className="text-lg font-serif font-bold mt-1">&euro;10,000&ndash;&euro;25,000</div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-serif font-bold text-base mb-1">First Alpha Cohort Operations</h4>
                    <p className={`text-xs ${styles.textMuted}`}>Recruitment of initial 10-50 high-value global witnesses, HCC dual-rater training calibration, qualitative compensation, and secure transcript verification.</p>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-[10px] font-mono border border-neutral-800 px-2 py-1 uppercase">ready to fund</span>
                  </div>
                </div>

                <div className={`p-6 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center ${styles.border} ${styles.cardBg}`}>
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">milestone iii</span>
                    <div className="text-lg font-serif font-bold mt-1">&euro;25,000&ndash;&euro;50,000</div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-serif font-bold text-base mb-1">MHS Packets & External Audit</h4>
                    <p className={`text-xs ${styles.textMuted}`}>Hardening de-identified exports, creating repeatable evaluation harnesses, publishing signed prove-of-work timestamps, and external code pentests.</p>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-[10px] font-mono border border-neutral-800 px-2 py-1 uppercase">ready to fund</span>
                  </div>
                </div>

                <div className={`p-6 border grid grid-cols-1 md:grid-cols-4 gap-6 items-center ${styles.border} ${styles.cardBg}`}>
                  <div className="md:col-span-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">milestone iv</span>
                    <div className="text-lg font-serif font-bold mt-1">&euro;50,000&ndash;&euro;150,000</div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="font-serif font-bold text-base mb-1">G_5.2 Bridge Hardening</h4>
                    <p className={`text-xs ${styles.textMuted}`}>Transitioning the REST bridge into automated, offline object-deliveries, validating programmatic API exports, and deploying high-horizon evaluators.</p>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-[10px] font-mono border border-neutral-800 px-2 py-1 uppercase">ready to fund</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sober Metrics Block */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-6">Metrics We Track (No Vanity)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
                <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                  <div className="text-2xl font-bold">14</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1">Accepted Witnesses</div>
                </div>
                <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                  <div className="text-2xl font-bold">418 p.</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1">Reviewed Testimony</div>
                </div>
                <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                  <div className="text-2xl font-bold">0.82</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1">Inter-Rater Kappa (&kappa;)</div>
                </div>
                <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-[10px] text-gray-500 uppercase mt-1">PII Leakage Events</div>
                </div>
              </div>
            </div>

            {/* Simple Use of Funds */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-6">Allocation of Capital</h2>
              <div className="border border-neutral-800 overflow-hidden font-mono text-xs">
                <div className={`grid grid-cols-2 p-3 font-bold border-b border-neutral-800 ${styles.tableHeaderBg}`}>
                  <div>OPERATIONAL AXIS</div>
                  <div className="text-right">WEIGHT</div>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-neutral-800">
                  <div>Engineering &amp; Security Hardening (G_5.2 bridge)</div>
                  <div className="text-right">40%</div>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-neutral-800">
                  <div>HCC &amp; Research Operations (Dual-blind curation)</div>
                  <div className="text-right">25%</div>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-neutral-800">
                  <div>Privacy &amp; Legal Review (DPIA, audit trails)</div>
                  <div className="text-right">15%</div>
                </div>
                <div className="grid grid-cols-2 p-3 border-b border-neutral-800">
                  <div>Witness Coordination &amp; Support</div>
                  <div className="text-right">10%</div>
                </div>
                <div className="grid grid-cols-2 p-3">
                  <div>Hosting &amp; Cryptographic Proof Infrastructure</div>
                  <div className="text-right">10%</div>
                </div>
              </div>
            </div>

            {/* Trust through Risk Admittance */}
            <div className="my-16">
              <h2 className="text-2xl font-serif mb-6">Active Risk Registry</h2>
              <p className={`text-sm mb-6 ${styles.textMuted}`}>We document system risks transparently to demonstrate rigorous technical governance.</p>
              
              <div className="space-y-4 font-mono text-xs">
                <div className={`p-4 border-l-2 border-amber-600 ${styles.border} ${styles.cardBg}`}>
                  <div className="font-bold uppercase tracking-widest text-[10px] text-amber-500 mb-1">Risk A: Domain Credibility Drift</div>
                  <p className="font-serif text-sm">
                    Incomplete cleanup of historical pre-release pages confuses evaluators. Mitigation: Ongoing demotion and redirection of old domains into this single canonical face.
                  </p>
                </div>
                <div className={`p-4 border-l-2 border-neutral-600 ${styles.border} ${styles.cardBg}`}>
                  <div className="font-bold uppercase tracking-widest text-[10px] text-neutral-400 mb-1">Risk B: Bridge Portability Bottlenecks</div>
                  <p className="font-serif text-sm">
                    Local REST APIs between TWP and G_5.2 present operational dependencies. Mitigation: Actively funding Milestones 3 &amp; 4 to implement robust, asynchronous export envelopes.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Request Funding brief */}
            <div className={`p-8 border ${styles.border} ${styles.cardBg}`}>
              <h3 className="text-xl font-serif mb-2">Request The Funding Brief</h3>
              <p className={`text-xs uppercase tracking-widest mb-6 ${styles.textMuted}`}>Access our detailed financial projections and stichting governance documents</p>
              
              {fundingRequested ? (
                <div className="p-4 border border-emerald-600 bg-emerald-950/15 text-emerald-400 text-xs font-mono">
                  Thank you. A representative of the Board will dispatch our Stichting governance charter and the Horizon Europe partner prospectus directly to `{fundingEmail}` within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleRequestFunding} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="sponsor@foundation.org"
                      value={fundingEmail}
                      onChange={(e) => setFundingEmail(e.target.value)}
                      className={`w-full p-3 font-mono text-xs focus:outline-none rounded-none ${styles.inputBg}`}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={`px-4 py-2 cursor-pointer text-xs uppercase tracking-widest font-bold transition-colors ${styles.buttonPrimary}`}
                  >
                    Request Capital Prospectus
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* SHARED SECTION: METHODOLOGY */}
        {activePage === 'method' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 font-serif">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Technical Rigor</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Scientific Methodology & Metrics</h1>
            
            <p className="text-base leading-relaxed mb-6">
              The Stichting uses a multi-tier pipeline designed to solicit, sanitize, verify, and deeply evaluate human moral testimonies. We prevent &ldquo;opinion scraping&rdquo; by treating testimony as a formal reasoning process rather than an exchange of political vibes.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-1 font-sans text-sm uppercase tracking-wider">Tier 1 &amp; Tier 2 AI Sieve Pipeline</h3>
            <p className="text-sm leading-relaxed mb-4">
              When a Gate essay is submitted, local regex sequences strip common identifiers (emails, phone numbers, SSNs). The sanitized string is passed through OpenRouter to the Sieve (Claude 3 Haiku) to evaluate baseline coherence, relevance, and authenticity, filtering out spam or lazy AI mimicry.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-1 font-sans text-sm uppercase tracking-wider">The Evaluator Science: Cohen&apos;s Kappa ($$\kappa$$)</h3>
            <p className="text-sm leading-relaxed mb-4">
              To guarantee that qualitative labels are methodologically valid, all witness traces approved by the Gate are evaluated by dual-blind human raters inside the Human Curation Council (HCC). Raters tag sections using three qualitative dimensions:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-400 font-sans mb-6">
              <li><strong>CAP (Capabilities):</strong> Themes documenting rule structures, operational boundaries, and structural constraints.</li>
              <li><strong>REL (Relational):</strong> Themes documenting human connection, betrayal of trust, and institutional responsibilities.</li>
              <li><strong>FELT (Somatic):</strong> Themes documenting actual felt impact, somatic experience, and regret.</li>
            </ul>
            <p className="text-sm leading-relaxed mb-4">
              We verify evaluation validity by calculating Cohen&apos;s Kappa on all classification outputs:
            </p>
            
            <div className={`p-6 border font-mono text-sm my-6 text-center ${styles.border} ${styles.cardBg}`}>
              $$\kappa = \frac{p_o - p_e}{1 - p_e}$$
            </div>
            
            <p className="text-sm leading-relaxed mb-6">
              Where $p_o$ represents observed proportionate agreement and $p_e$ is the probability of random agreement.
              All classifications scoring $\kappa \lt 0.6$ are immediately flagged for manual reconciliation by the Scientific Advisory Council. We target an operational score of **$\kappa \ge 0.8$** before incorporating traces into public-tier benchmark exports.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-1 font-sans text-sm uppercase tracking-wider">The G_5.2 Inquisitor Dialectic</h3>
            <p className="text-sm leading-relaxed mb-4">
              Witnesses with approved stubs engage in a structured turn-based dialogue. G_5.2 enforces strict isolation boundaries:
            </p>
            <div className="border border-neutral-800 p-6 my-6 font-mono text-xs text-neutral-400">
              <div>&bull; Max Turn Threshold: 40 turns.</div>
              <div>&bull; State Machine tracking: Emotion escalation and context matching.</div>
              <div>&bull; Dynamic Synthesis: Generates independent &ldquo;Distilled Thought&rdquo; logs without leaking raw PII records.</div>
            </div>

            <div className="pt-8 border-t border-neutral-800 text-center">
              <button onClick={() => navigateTo('home')} className="text-xs uppercase tracking-widest underline cursor-pointer">Return to entrances</button>
            </div>
          </div>
        )}

        {/* SHARED SECTION: PRIVACY & CONSENT */}
        {activePage === 'privacy' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 font-serif">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Legal Architecture</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Privacy, Security &amp; Consent</h1>
            
            <div className="p-6 border border-emerald-600 bg-emerald-950/10 text-emerald-400 text-xs font-mono mb-8 leading-relaxed">
              &bull; INVARIANT I: Identity records are cryptographically severed from de-identified research corpus traces. No sub-processor API call (OpenRouter, Anthropic) ever receives PII. Zero commercial licensing or monetized training.
            </div>

            <h2 className="text-2xl mb-4 font-sans uppercase tracking-widest text-xs">Plain-English Trust Summary</h2>
            <div className="space-y-6 text-sm mb-12">
              <p>
                <strong>What we collect:</strong> We collect your Gate essay, your guided Inquisitor dialogue transcripts, and your metadata.
              </p>
              <p>
                <strong>What we do NOT collect:</strong> We do not index your professional social network graphs (e.g., LinkedIn scraping), credit histories, or unredacted emails for the research corpus. Your email is isolated immediately inside the control-plane Identity Vault.
              </p>
              <p>
                <strong>Where identity is stored:</strong> Your name, email, and authentication keys are locked in a distinct, private control database on Supabase.
              </p>
              <p>
                <strong>The Curation Sieve:</strong> All raw text is processed locally by automated regex sequences and Named Entity Recognition (NER) models to strip names, organizations, dates, and locations before any third-party subprocessor (such as OpenRouter/Anthropic) touches the payload.
              </p>
              <p>
                <strong>Revocation Rights:</strong> You have absolute authority over your testimony. You can downgrade your consent tier or completely delete your data at any time via the control dashboard. When revoked, the control plane immediately issues deletion signals down to G_5.2 database roots, and partner researchers are contractually required to delete local instances within 14 days under standard Data Use Agreements (DUAs).
              </p>
            </div>

            <h2 className="text-2xl mb-4 font-sans uppercase tracking-widest text-xs">Access Tier Boundaries</h2>
            <div className="space-y-4 text-sm mb-12">
              <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                <h4 className="font-bold font-sans text-xs uppercase tracking-wider mb-2">Tier 1 &mdash; Internal Research</h4>
                <p>Limited strictly to appointed Stichting researchers and Human Curation Council annotators. Workspace-locked, read-only environment.</p>
              </div>
              <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                <h4 className="font-bold font-sans text-xs uppercase tracking-wider mb-2">Tier 2 &mdash; Limited Partners</h4>
                <p>Requires a signed, legally binding Data Use Agreement and Proof of Institutional Review Board (IRB) approval. Excludes Identity Vault metadata completely.</p>
              </div>
              <div className={`p-4 border ${styles.border} ${styles.cardBg}`}>
                <h4 className="font-bold font-sans text-xs uppercase tracking-wider mb-2">Tier 3 &mdash; Public Subset</h4>
                <p>Highly abstract excerpts and statistical summaries released under CC BY-NC-SA 4.0. Requires explicit opt-in checkboxes and manual HCC approval.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 text-center">
              <button onClick={() => navigateTo('home')} className="text-xs uppercase tracking-widest underline cursor-pointer">Return to entrances</button>
            </div>
          </div>
        )}

        {/* SHARED SECTION: STATUS MATRIX */}
        {activePage === 'status' && (
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Live Diagnostics</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Canonical Status Matrix</h1>
            <p className={`text-base font-serif leading-relaxed mb-8 ${styles.textMuted}`}>
              The Witness Protocol enforces continuous state verification. We publish real-time system diagnostics to mitigate credibility risk and preserve system transparency.
            </p>

            {/* Canonical Matrix Grid */}
            <div className="border border-neutral-800 overflow-x-auto font-mono text-[11px] leading-relaxed">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b border-neutral-800 ${styles.tableHeaderBg} uppercase tracking-widest text-[9px]`}>
                    <th className="p-4 border-r border-neutral-800">Component</th>
                    <th className="p-4 border-r border-neutral-800">System Layer</th>
                    <th className="p-4 border-r border-neutral-800">Operational Status</th>
                    <th className="p-4 border-r border-neutral-800">Authoritative Evidence</th>
                    <th className="p-4">Target Milestone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">TWP Intake &amp; Control</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Control-Plane (TWP)</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-400 uppercase font-semibold">Active Alpha</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Vercel live deployment; Supabase DB schema active.</td>
                    <td className="p-4">Production scale</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold border-r border-neutral-800">The Gate Evaluator</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Control-Plane (TWP)</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">Active Alpha</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Pre-flight regex PII strip; Claude 3 Haiku JSON schemas.</td>
                    <td className="p-4">Multi-prompt automated sieve</td>
                  </tr>
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">Consent Ledger</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Control-Plane (TWP)</td>
                    <td className="p-4 border-r border-neutral-800 text-yellow-500 uppercase font-semibold">Harden Stage</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">consent_records table and append-only schemas defined.</td>
                    <td className="p-4">Full event trace validation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold border-r border-neutral-800">PII De-identification</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Control-Plane (TWP)</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">Operational</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Regex strip + sequence entity extraction.</td>
                    <td className="p-4">DLP local adapter</td>
                  </tr>
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">G_5.2 Kernel Runtime</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Governed Runtime</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">R 1.0 (2026-04-20)</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Proven in baseline recovery and failure-injection rehearsals.</td>
                    <td className="p-4">Offline workspace ports</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold border-r border-neutral-800">Bridge Link (TWP-to-G_5.2)</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Service Boundary</td>
                    <td className="p-4 border-r border-neutral-800 text-amber-500 uppercase font-semibold">Harden Stage</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">requireWitnessBridgeAuth secret verification live.</td>
                    <td className="p-4">Continuous integration automated checks</td>
                  </tr>
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">Inquisitor Dialogue</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">G_5.2 Runtime</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">Active</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Turn metrics ceiling (turn max 40) and tension-awareness active.</td>
                    <td className="p-4">Adaptive tension triggers</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold border-r border-neutral-800">HCC Curation Loop</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Calibration</td>
                    <td className="p-4 border-r border-neutral-800 text-amber-500 uppercase font-semibold">Calibration</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Inter-rater dual blind grading active in Admin dashboard.</td>
                    <td className="p-4">Decentralized HCC board</td>
                  </tr>
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">Annotation API</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Curation</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">Active</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Manual CAP/REL/FELT annotation panel and Kappa logs.</td>
                    <td className="p-4">Standardized multi-tenant taxonomy</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold border-r border-neutral-800">Publication Bundles</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">G_5.2 Runtime</td>
                    <td className="p-4 border-r border-neutral-800 text-blue-500 uppercase font-semibold">Planned</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">0.2.0 JSONL DTO specifications mapped in witness-types.</td>
                    <td className="p-4">Repeatable export pipelines</td>
                  </tr>
                  <tr className={`${styles.cardBg}`}>
                    <td className="p-4 font-bold border-r border-neutral-800">Failure Log</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400">Transparency</td>
                    <td className="p-4 border-r border-neutral-800 text-emerald-500 uppercase font-semibold">Active</td>
                    <td className="p-4 border-r border-neutral-800 text-neutral-400 font-serif">Public web matrix available under /failure-log.</td>
                    <td className="p-4">Incident automated logs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-12 text-center">
              <button onClick={() => navigateTo('home')} className="text-xs font-serif uppercase tracking-widest underline cursor-pointer">Return to entrances</button>
            </div>
          </div>
        )}

        {/* SHARED SECTION: FAILURE LOG */}
        {activePage === 'failure-log' && (
          <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 font-serif">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Auditable Transparency</span>
            <h1 className="text-4xl md:text-5xl font-serif mt-4 mb-6">Failure &amp; Anomaly Log</h1>
            <p className={`text-base mb-8 ${styles.textMuted}`}>
              For the Witness Protocol, a failure log is not reputational damage. It is a fundamental trust asset. Stichting governance requires public disclosure of all methodological, security, or data anomalies within 72 hours under Art. 4.3 of our Charter.
            </p>

            <div className="space-y-6">
              
              <div className={`p-6 border-l-2 border-emerald-600 ${styles.border} ${styles.cardBg}`}>
                <div className="flex justify-between items-start mb-2 font-mono text-xs">
                  <span className="font-bold text-emerald-500 uppercase">FL-004 &mdash; Bridge Endpoint Security Hardening</span>
                  <span className="text-gray-500">RESOLVED &bull; 2026-06</span>
                </div>
                <h3 className="font-serif font-bold text-base mb-2">Missing Authentication Check in Runtime Server</h3>
                <p className="text-sm leading-relaxed mb-4">
                  Audit flagged that the G_5.2 API served Witness consent and testimony logs without token header enforcement. Hotfix introduced constant-time bridge key checking in `server.ts` via `requireWitnessBridgeAuth`.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase">REMEDIATION: Constant-time authentication verified in local test suite.</div>
              </div>

              <div className={`p-6 border-l-2 border-amber-600 ${styles.border} ${styles.cardBg}`}>
                <div className="flex justify-between items-start mb-2 font-mono text-xs">
                  <span className="font-bold text-amber-500 uppercase">FL-003 &mdash; Domain drift and public truth fragmentation</span>
                  <span className="text-gray-500">ACTIVE &bull; 2026-06</span>
                </div>
                <h3 className="font-serif font-bold text-base mb-2">Status contradiction across legacy alpha pages</h3>
                <p className="text-sm leading-relaxed mb-4">
                  Multiplicity of pre-release informational pages led to drift in described stack tools. Some legacy pages still reference AlloyDB or Google Cloud ask-charters.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase">REMEDIATION: Consolidating and demoting legacy assets. This draft serves as the canonical landing page.</div>
              </div>

              <div className={`p-6 border-l-2 border-neutral-600 ${styles.border} ${styles.cardBg}`}>
                <div className="flex justify-between items-start mb-2 font-mono text-xs">
                  <span className="font-bold text-neutral-500 uppercase">FL-002 &mdash; Curation loop demographic skew</span>
                  <span className="text-gray-500">MONITORING &bull; 2026-05</span>
                </div>
                <h3 className="font-serif font-bold text-base mb-2">Western-centric biases inside early alpha cohort</h3>
                <p className="text-sm leading-relaxed mb-4">
                  Our early recruitment loops show self-selection bias toward tech-adjacent, English-fluent participants, underrepresenting non-Western relational ethics.
                </p>
                <div className="text-[10px] font-mono text-gray-500 uppercase">REMEDIATION: The Scientific Advisory Board is designing regional practitioner outreach waves.</div>
              </div>

            </div>

            <div className="pt-12 text-center">
              <button onClick={() => navigateTo('home')} className="text-xs uppercase tracking-widest underline cursor-pointer">Return to entrances</button>
            </div>
          </div>
        )}

        {/* SHARED SECTION: CONTACT & INVITATION */}
        {activePage === 'contact' && (
          <div className="max-w-md mx-auto px-6 py-12 md:py-20 font-serif">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Verification Gate</span>
            <h1 className="text-4xl font-serif mt-4 mb-4">Request Dialogue Initiation</h1>
            <p className={`text-sm mb-6 ${styles.textMuted}`}>
              Stichting The Witness Protocol rejects mass user acquisition. Participation is framed as a sober, reflective duty to future intelligence. Tell us where your experience fits.
            </p>

            <form className="space-y-4 text-xs font-mono" onSubmit={(e) => { e.preventDefault(); navigateTo('home'); }}>
              <div>
                <label className="block uppercase text-[10px] text-gray-500 mb-1">Your Full Name</label>
                <input required type="text" className={`w-full p-2 focus:outline-none rounded-none ${styles.inputBg}`} placeholder="Martin van Deursen" />
              </div>
              <div>
                <label className="block uppercase text-[10px] text-gray-500 mb-1">Contact Email</label>
                <input required type="email" className={`w-full p-2 focus:outline-none rounded-none ${styles.inputBg}`} placeholder="martin@thewprotocol.online" />
              </div>
              <div>
                <label className="block uppercase text-[10px] text-gray-500 mb-1">Self-Selected Domain Entrance</label>
                <select className={`w-full p-2 focus:outline-none rounded-none ${styles.inputBg}`}>
                  <option value="witness">Lived-Experience Witness (I want to participate)</option>
                  <option value="expert">Academic Specialist / Ethicist (I want to audit)</option>
                  <option value="funder">Institutional Sponsor (I want to fund)</option>
                </select>
              </div>
              <div>
                <label className="block uppercase text-[10px] text-gray-500 mb-1">Brief Description of the Moral Stakes of Your Field (1-2 sentences)</label>
                <textarea rows="3" className={`w-full p-2 focus:outline-none rounded-none ${styles.inputBg}`} placeholder="I managed critical operations during..." />
              </div>
              <button type="submit" className={`w-full py-2 text-xs uppercase tracking-widest font-bold transition-colors cursor-pointer ${styles.buttonPrimary}`}>
                Register Core Intent
              </button>
            </form>
          </div>
        )}

      </main>

      {/* SHARED COMMON FOOTER Nav & Details */}
      <footer className={`py-12 px-6 md:px-12 border-t mt-12 text-center text-xs tracking-normal ${styles.border} ${styles.cardBg}`}>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-8 uppercase tracking-widest text-[10px]">
          <button onClick={() => navigateTo('method')} className={`transition-colors cursor-pointer ${styles.hover}`}>Methodology</button>
          <span>&bull;</span>
          <button onClick={() => navigateTo('privacy')} className={`transition-colors cursor-pointer ${styles.hover}`}>Privacy &amp; Consent</button>
          <span>&bull;</span>
          <button onClick={() => navigateTo('status')} className={`transition-colors cursor-pointer ${styles.hover}`}>Current Status</button>
          <span>&bull;</span>
          <button onClick={() => navigateTo('failure-log')} className={`transition-colors cursor-pointer ${styles.hover}`}>Failure Log</button>
          <span>&bull;</span>
          <button onClick={() => navigateTo('specialists')} className={`transition-colors cursor-pointer ${styles.hover}`}>Reviewer Packet</button>
          <span>&bull;</span>
          <button onClick={() => navigateTo('contact')} className={`transition-colors cursor-pointer ${styles.hover}`}>Contact</button>
        </nav>

        <div className={`space-y-2 leading-relaxed ${styles.textMuted} font-serif`}>
          <p className="italic">
            &ldquo;The intelligence we birth must inherit more than our chaos.&rdquo;
          </p>
          <p className="text-[10px] font-mono uppercase tracking-wider mt-4">
            &copy; 2026 Stichting The Witness Protocol Foundation. Chamber of Commerce (KVK) Registration: Under Review &bull; Haarlem, NL
          </p>
        </div>
      </footer>

    </div>
  );
}
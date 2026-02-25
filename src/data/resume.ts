/**
 * Project Me - Resume Data
 * Synced with LaTeX resume (2025-02-25)
 */

export interface Resume {
  personal: PersonalInfo;
  summary: string;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  honors: Honor[];
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  position: string;
  tagline: string;
  location: string;
  mobile: string;
  email: string;
  github: string;
  linkedin: string;
  quote: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Project {
  name: string;
  techStack: string[];
  link: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
  details: string[];
}

export interface Honor {
  title: string;
  description: string;
  organization: string;
  year: string;
}

export const RESUME: Resume = {
  personal: {
    name: 'Chirag Singhal',
    firstName: 'Chirag',
    lastName: 'Singhal',
    position: 'Software Engineer',
    tagline:
      'Full Stack, Backend & Distributed Systems Specialist',
    location: 'Bhubaneswar, Odisha, India',
    mobile: '(+91) 74284-49707',
    email: 'hi@chirag127.in',
    github: 'chirag127',
    linkedin: 'chirag127',
    quote:
      'Building scalable, resilient systems across the full Software Development Life Cycle (SDLC).',
  },

  summary:
    'Results-oriented Software Engineer with extensive experience across the full Software Development Life Cycle (SDLC), specializing in scalable backend architectures, full-stack development, AI-driven automation, and cloud-native deployments. Proficient in modern Python and JavaScript/TypeScript ecosystems (React, Node.js, FastAPI, Astro) with deep expertise in Microservices, Serverless Architectures, DevOps, and Security Engineering. A rapid learner and academic topper (JEE Advanced Rank Holder) with a proven ability to reduce system latency, build production-grade platforms, optimize enterprise data pipelines, and implement robust security practices in distributed environments.',

  skills: [
    {
      category: 'Languages',
      skills: [
        'Python (Advanced)',
        'TypeScript',
        'JavaScript',
        'SQL (PostgreSQL, MySQL, LibSQL)',
        'HTML5',
        'CSS3',
      ],
    },
    {
      category: 'Backend & Cloud',
      skills: [
        'FastAPI',
        'Node.js',
        'Django',
        'GraphQL',
        'Kafka',
        'Redis',
        'Upstash Redis',
        'AWS (Lambda, EKS, S3)',
        'Cloudflare Workers',
        'Docker',
        'Kubernetes',
        'Terraform',
      ],
    },
    {
      category: 'Frontend & Full Stack',
      skills: [
        'React.js',
        'Astro',
        'Tailwind CSS',
        'Redux',
        'Chart.js',
        'MDX',
        'RESTful APIs',
        'Microservices Architecture',
        'Serverless Architectures',
        'PWA',
      ],
    },
    {
      category: 'AI & Data Engineering',
      skills: [
        'LangChain',
        'RAG Pipelines',
        'Vector DBs (Milvus/Chroma)',
        'Hugging Face',
        'Google Gemini',
        'Groq',
        'Mistral AI',
        'Cohere',
        'NVIDIA NIM',
        'OpenRouter',
        'Multi-Provider LLM Integration',
        'ETL Pipelines',
        'PyTorch',
        'Web Scraping (BeautifulSoup/Cheerio)',
      ],
    },
    {
      category: 'Databases & Storage',
      skills: [
        'Firebase Firestore',
        'Supabase (PostgreSQL)',
        'MongoDB',
        'Turso (LibSQL)',
        'Upstash Redis',
        'Cloudflare R2 (S3-Compatible)',
        'Sanity CMS',
        'Algolia Search',
      ],
    },
    {
      category: 'DevOps & CI/CD',
      skills: [
        'GitHub Actions',
        'Jenkins',
        'Cloudflare Pages Deployment',
        'Wrangler CLI',
        'Cron-Scheduled Workflows',
        'Infrastructure as Code (IaC)',
        'Docker',
        'Kubernetes',
        'Linux Admin',
      ],
    },
    {
      category: 'Security & Auth',
      skills: [
        'Kinde Auth',
        'Firebase Auth',
        'OAuth 2.0 (PKCE)',
        'reCAPTCHA v3',
        'Client-Side Encryption (AES/DES/3DES/RC4)',
        'Bcrypt',
        '40+ Cryptographic Hash Algorithms',
        'OWASP',
        'DevSecOps',
        'Secure Coding',
      ],
    },
    {
      category: 'Payments & Analytics',
      skills: [
        'Razorpay (Orders, Webhooks, Verification)',
        'PostHog Analytics',
        'Google AdSense',
        'OneSignal Push Notifications',
        'Cloudinary Media Optimization',
      ],
    },
    {
      category: 'Core Competencies',
      skills: [
        'System Design (HLD/LLD)',
        'OOP',
        'SOLID Principles',
        'Distributed Systems',
        'Modular Architecture',
        'Unit/Integration Testing',
        'TDD',
        'Agile Methodologies',
      ],
    },
  ],

  experience: [
    {
      title: 'Software Engineer',
      company: 'Tata Consultancy Services (TCS)',
      location: 'Bhubaneswar, India',
      startDate: 'Jun. 2025',
      endDate: 'Present',
      current: true,
      highlights: [
        'Optimized enterprise-scale pricing engines and business logic using Python, reducing processing latency by 60% for high-volume transactions.',
        'Architected modular data validation pipelines bridging legacy systems with modern RESTful APIs, ensuring data integrity across the SDLC.',
        'Implemented Automated CI/CD Workflows and standardized testing protocols, significantly reducing production bugs and rollback rates.',
        'Designed and maintained responsive, dynamic UI components using React.js to provide real-time visibility into backend configurations.',
        'Refactored monolithic legacy codebases into maintainable, object-oriented modules while enforcing strict security and performance standards.',
      ],
    },
    {
      title: 'Software Developer (Full Stack)',
      company: 'QRsay.com',
      location: 'Remote, India',
      startDate: 'Jul. 2023',
      endDate: 'May 2025',
      current: false,
      highlights: [
        'Managed the full software life cycle for a high-traffic Food E-commerce platform using Python, Node.js, and MongoDB.',
        'Executed database tuning and indexing strategies, achieving a 40% reduction in API response times for critical administrative dashboards.',
        'Developed real-time order processing systems and event-driven architectures using Kafka to synchronize data across multiple distributed outlets.',
        'Built secure payment gateway integrations and authentication modules with a focus on robust cybersecurity and data privacy.',
        'Engineered modular frontend components in React.js to deliver a seamless and performant user experience across devices.',
      ],
    },
  ],

  projects: [
    {
      name: 'Oriz — 1000+ Free Online Tools Platform',
      techStack: [
        'TypeScript',
        'React',
        'Astro',
        'Python',
        'Cloudflare Workers',
        'Firebase',
        'Razorpay',
      ],
      link: 'oriz.in',
      highlights: [
        'Engineered a production-grade full-stack platform (oriz.in) with 192+ client-side tools across 8 categories using Astro, React, TypeScript, and Tailwind CSS, deployed on Cloudflare Pages.',
        'Built a real-time data API marketplace with 69 Python web scrapers across finance, crypto, weather, sports, and news domains, orchestrated by 5 GitHub Actions CI/CD pipelines.',
        'Integrated 10 AI/LLM providers (Gemini, Groq, Mistral, Cohere, NVIDIA NIM, OpenRouter, Cerebras, HuggingFace) into a unified chatbot interface with provider-agnostic abstraction.',
        'Architected multi-cloud backend: Firebase (Auth + Firestore), Supabase, Turso (LibSQL), Upstash Redis, Cloudflare R2, Algolia Search, Sanity CMS, and Razorpay payment gateway.',
        'Implemented 40+ cryptographic hash algorithms, client-side encryption (AES/DES/3DES/RC4), Kinde Auth (PKCE), and 100% client-side processing for maximum user privacy.',
        'Built 8 serverless edge functions on Cloudflare Workers handling comments, ratings, file uploads (R2), email dispatch, reCAPTCHA verification, payment webhooks, and view tracking.',
      ],
    },
    {
      name: 'NexusAI - Multi-Agent RAG Platform',
      techStack: [
        'Python',
        'LangGraph',
        'OpenAI',
        'Docker',
        'Kubernetes',
      ],
      link: 'github.com/chirag127/NexusAI-Agentic-Workflows',
      highlights: [
        'Architected an Agentic AI Platform using LangGraph that orchestrates multiple autonomous LLM agents to solve complex coding tasks.',
        'Implemented a Graph-based RAG pipeline using Neo4j and Vector Embeddings to provide high-precision context retrieval for enterprise documentation.',
        'Deployed the system on Kubernetes with auto-scaling capabilities to handle concurrent agent execution threads in a cloud-native environment.',
      ],
    },
    {
      name: 'TubeDigest - Multimodal Sponsor Detection',
      techStack: [
        'Python',
        'Transformers',
        'ONNX Runtime',
        'PyTorch',
      ],
      link: 'github.com/chirag127/TubeDigest-AI-Sponsor-Block',
      highlights: [
        'Developed a high-performance AI engine to detect sponsor segments using Hugging Face Transformers and multimodal analysis (Audio + Text).',
        'Fine-tuned a T5 Model and optimized inference speed by 3x using ONNX Runtime and dynamic quantization techniques.',
        'Built a scalable Flask microservice to process real-time video streams with sub-second latency, incorporating secure API endpoints.',
      ],
    },
    {
      name: 'Olivia - Edge AI Voice Assistant',
      techStack: [
        'Python',
        'Edge AI',
        'Llama-3',
        'TensorFlow Lite',
      ],
      link: 'github.com/chirag127/Olivia-Voice-Assistant',
      highlights: [
        'Engineered a privacy-first Virtual Assistant utilizing Local LLMs (Llama-3) for intent classification and complex command execution.',
        'Implemented an Edge Computing architecture to process voice commands locally, eliminating cloud latency and ensuring offline functionality.',
        'Designed a plugin-based system enabling seamless integration with IoT devices and system automation scripts, with secure data handling.',
      ],
    },
    {
      name: 'Crawl4AI - Distributed RAG Ingestion',
      techStack: [
        'Python',
        'Redis',
        'Distributed Crawling',
        'Selenium',
      ],
      link: 'github.com/chirag127/Crawl4AI-LLM-Optimized-Web-Crawler',
      highlights: [
        'Designed a Distributed Web Crawler utilizing Redis Task Queues to ingest massive datasets for LLM training pipelines.',
        'Implemented intelligent stealth drivers and proxy rotation to bypass enterprise-grade WAFs and anti-bot protections.',
        'Optimized data parsing algorithms to convert unstructured HTML into structured JSON/Markdown for Vector Database ingestion, ensuring data security.',
      ],
    },
    {
      name: 'CloudLens - Serverless Event Pipeline',
      techStack: [
        'Python',
        'AWS Lambda',
        'Terraform',
        'Azure Functions',
      ],
      link: 'github.com/chirag127/CloudLens-Serverless-Architecture',
      highlights: [
        'Designed an Event-Driven Architecture on AWS Lambda to automatically process and categorize high-volume media assets.',
        'Implemented Infrastructure as Code (IaC) using Terraform to provision reproducible staging and production environments across AWS and Azure.',
        'Integrated CloudWatch and Prometheus for full-stack observability and automated alert handling.',
      ],
    },
    {
      name: 'StreamGuard - Real-Time Fraud Analytics',
      techStack: [
        'Python',
        'Kafka',
        'Spark Streaming',
        'PySpark',
      ],
      link: 'github.com/chirag127/StreamGuard-Fraud-Detection',
      highlights: [
        'Architected a scalable streaming pipeline using Apache Kafka to ingest and process 10k+ transaction events per second.',
        'Developed PySpark microservices deployed on Kubernetes to detect fraud anomalies with sub-200ms end-to-end latency, incorporating ML models.',
      ],
    },
    {
      name: 'OmniPublish - Content Orchestration Engine',
      techStack: [
        'Python',
        'System Design',
        'Microservices',
        'Node.js',
      ],
      link: 'github.com/chirag127/OmniPublish-Platform',
      highlights: [
        'Architected a robust API Gateway using the Adapter Pattern to unify 17+ external platforms (LinkedIn, Twitter) into a single interface.',
        'Implemented Circuit Breaker patterns and asynchronous retry mechanisms (Celery) to ensure fault tolerance across distributed APIs, with full-stack integration.',
      ],
    },
  ],

  education: [
    {
      degree: 'B.Tech in Computer Science and Engineering',
      institution:
        'Dr. A.P.J. Abdul Kalam Technical University',
      location: 'Lucknow, India',
      year: 'Sep. 2020 - Jul. 2024',
      details: [
        'CGPA: 8.81 (Aggregate) | College Topper (Rank 1)',
        'Rank 1 in College Coding Competition (2022)',
      ],
    },
    {
      degree: 'Senior Secondary (Class 12th) - CBSE',
      institution: 'DDPS, Sanjay Nagar',
      location: 'Ghaziabad, India',
      year: '2020',
      details: [
        'Percentage: 97% | School Topper (Rank 1)',
        'IIT JEE Advanced 2020: AIR 11870 (Top 1%)',
      ],
    },
  ],

  honors: [
    {
      title: 'College Topper',
      description:
        'Rank 1 in Computer Science Engineering Batch (2020-2024)',
      organization: 'AKTU',
      year: '2024',
    },
    {
      title: 'JEE Advanced',
      description:
        'Secured All India Rank 11870 (99th Percentile)',
      organization: 'India',
      year: '2020',
    },
    {
      title: 'Meta Backend Developer',
      description: 'Meta Backend Developer Course (Coursera)',
      organization: 'Online',
      year: '2023',
    },
    {
      title: 'AWS Certified Developer',
      description: 'AWS Certified Developer - Associate',
      organization: 'Online',
      year: '2025',
    },
  ],
};

export default RESUME;

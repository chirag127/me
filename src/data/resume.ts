export interface Experience {
  title: string;
  company: string;
  location: string;
  date: string;
  items: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  date: string;
  items: string[];
}

export interface Project {
  name: string;
  tech: string;
  link: string;
  items: string[];
  featured?: boolean;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Honor {
  title: string;
  description: string;
  location: string;
  year: string;
}

export const summary = `Results-oriented Software Engineer with extensive experience across the full Software Development Life Cycle (SDLC), specializing in scalable backend architectures, full-stack development, AI-driven automation, and cloud-native deployments. Proficient in modern Python and JavaScript/TypeScript ecosystems (React, Node.js, FastAPI, Astro) with deep expertise in Microservices, Serverless Architectures, DevOps, and Security Engineering. A rapid learner and academic topper (JEE Advanced Rank Holder) with a proven ability to reduce system latency, build production-grade platforms, optimize enterprise data pipelines, and implement robust security practices in distributed environments.`;

export const skills: Skill[] = [
  { category: "Languages", items: ["Python (Advanced)", "TypeScript", "JavaScript", "SQL (PostgreSQL, MySQL, LibSQL)", "HTML5", "CSS3"] },
  { category: "Backend & Cloud", items: ["FastAPI", "Node.js", "Django", "GraphQL", "Kafka", "Redis", "Upstash Redis", "AWS (Lambda, EKS, S3)", "Cloudflare Workers", "Docker", "Kubernetes", "Terraform"] },
  { category: "Frontend & Full Stack", items: ["React.js", "Astro", "Tailwind CSS", "Redux", "Chart.js", "MDX", "RESTful APIs", "Microservices Architecture", "Serverless Architectures", "PWA"] },
  { category: "AI & Data Engineering", items: ["LangChain", "RAG Pipelines", "Vector DBs (Milvus/Chroma)", "Hugging Face", "Google Gemini", "Groq", "Mistral AI", "Cohere", "NVIDIA NIM", "OpenRouter", "Multi-Provider LLM Integration", "ETL Pipelines", "PyTorch", "Web Scraping"] },
  { category: "Databases & Storage", items: ["Firebase Firestore", "Supabase (PostgreSQL)", "MongoDB", "Turso (LibSQL)", "Upstash Redis", "Cloudflare R2", "Sanity CMS", "Algolia Search"] },
  { category: "DevOps & CI/CD", items: ["GitHub Actions", "Jenkins", "Cloudflare Pages Deployment", "Wrangler CLI", "Cron-Scheduled Workflows", "Infrastructure as Code (IaC)", "Docker", "Kubernetes", "Linux Admin"] },
  { category: "Security & Auth", items: ["Kinde Auth", "Firebase Auth", "OAuth 2.0 (PKCE)", "reCAPTCHA v3", "Client-Side Encryption", "Bcrypt", "40+ Cryptographic Hash Algorithms", "OWASP", "DevSecOps"] },
  { category: "Core Competencies", items: ["System Design (HLD/LLD)", "OOP", "SOLID Principles", "Distributed Systems", "Modular Architecture", "Unit/Integration Testing", "TDD", "Agile Methodologies"] },
];

export const experience: Experience[] = [
  {
    title: "Software Engineer",
    company: "Tata Consultancy Services (TCS)",
    location: "Bhubaneswar, India",
    date: "Jun. 2025 - Present",
    items: [
      "Optimized enterprise-scale pricing engines and business logic using Python, reducing processing latency by 60% for high-volume transactions.",
      "Architected modular data validation pipelines bridging legacy systems with modern RESTful APIs, ensuring data integrity across the SDLC.",
      "Implemented Automated CI/CD Workflows and standardized testing protocols, significantly reducing production bugs and rollback rates.",
      "Designed and maintained responsive, dynamic UI components using React.js to provide real-time visibility into backend configurations.",
      "Refactored monolithic legacy codebases into maintainable, object-oriented modules while enforcing strict security and performance standards.",
    ],
  },
  {
    title: "Software Developer (Full Stack)",
    company: "QRsay.com",
    location: "Remote, India",
    date: "Jul. 2023 - May 2025",
    items: [
      "Managed the full software life cycle for a high-traffic Food E-commerce platform using Python, Node.js, and MongoDB.",
      "Executed database tuning and indexing strategies, achieving a 40% reduction in API response times for critical administrative dashboards.",
      "Developed real-time order processing systems and event-driven architectures using Kafka to synchronize data across multiple distributed outlets.",
      "Built secure payment gateway integrations and authentication modules with a focus on robust cybersecurity and data privacy.",
      "Engineered modular frontend components in React.js to deliver a seamless and performant user experience across devices.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "B.Tech in Computer Science and Engineering",
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    location: "Lucknow, India",
    date: "Sep. 2020 - Jul. 2024",
    items: ["CGPA: 8.81 (Aggregate) | College Topper (Rank 1)", "Rank 1 in College Coding Competition (2022)"],
  },
  {
    degree: "Senior Secondary (Class 12th) - CBSE",
    institution: "DDPS, Sanjay Nagar",
    location: "Ghaziabad, India",
    date: "2020",
    items: ["Percentage: 97% | School Topper (Rank 1)", "IIT JEE Advanced 2020: AIR 11870 (Top 1%)"],
  },
];

export const projects: Project[] = [
  {
    name: "Oriz — 1000+ Free Online Tools Platform",
    tech: "TypeScript, React, Astro, Python, Cloudflare Workers, Firebase, Razorpay",
    link: "oriz.in",
    featured: true,
    items: [
      "Engineered a production-grade full-stack platform with 192+ client-side tools across 8 categories using Astro, React, TypeScript, and Tailwind CSS, deployed on Cloudflare Pages.",
      "Built a real-time data API marketplace with 69 Python web scrapers across finance, crypto, weather, sports, and news domains, orchestrated by 5 GitHub Actions CI/CD pipelines.",
      "Integrated 10 AI/LLM providers into a unified chatbot interface with provider-agnostic abstraction and intelligent fallback routing.",
      "Architected multi-cloud backend: Firebase (Auth + Firestore), Supabase, Turso, Upstash Redis, Cloudflare R2, Algolia Search, Sanity CMS, and Razorpay.",
      "Implemented 40+ cryptographic hash algorithms, client-side encryption, Kinde Auth (PKCE), Firestore security rules, and 100% client-side processing.",
      "Built 8 serverless edge functions on Cloudflare Workers handling comments, ratings, file uploads, email dispatch, reCAPTCHA verification, payment webhooks, and view tracking.",
    ],
  },
  {
    name: "NexusAI - Multi-Agent RAG Platform",
    tech: "Python, LangGraph, OpenAI, Docker, Kubernetes",
    link: "github.com/chirag127/NexusAI-Agentic-Workflows",
    featured: true,
    items: [
      "Architected an Agentic AI Platform using LangGraph that orchestrates multiple autonomous LLM agents to solve complex coding tasks.",
      "Implemented a Graph-based RAG pipeline using Neo4j and Vector Embeddings for high-precision context retrieval.",
      "Deployed on Kubernetes with auto-scaling to handle concurrent agent execution threads.",
    ],
  },
  {
    name: "TubeDigest - Multimodal Sponsor Detection",
    tech: "Python, Transformers, ONNX Runtime, PyTorch",
    link: "github.com/chirag127/TubeDigest-AI-Sponsor-Block",
    featured: true,
    items: [
      "Developed a high-performance AI engine to detect sponsor segments using Hugging Face Transformers and multimodal analysis.",
      "Fine-tuned a T5 Model and optimized inference speed by 3x using ONNX Runtime and dynamic quantization.",
      "Built a scalable Flask microservice to process real-time video streams with sub-second latency.",
    ],
  },
  {
    name: "Olivia - Edge AI Voice Assistant",
    tech: "Python, Edge AI, Llama-3, TensorFlow Lite",
    link: "github.com/chirag127/Olivia-Voice-Assistant",
    featured: true,
    items: [
      "Engineered a privacy-first Virtual Assistant utilizing Local LLMs for intent classification and command execution.",
      "Implemented an Edge Computing architecture for local voice processing, eliminating cloud latency.",
      "Designed a plugin-based system for IoT integration and system automation.",
    ],
  },
  {
    name: "Crawl4AI - Distributed RAG Ingestion",
    tech: "Python, Redis, Distributed Crawling, Selenium",
    link: "github.com/chirag127/Crawl4AI-LLM-Optimized-Web-Crawler",
    items: [
      "Designed a Distributed Web Crawler utilizing Redis Task Queues for massive dataset ingestion.",
      "Implemented intelligent stealth drivers and proxy rotation to bypass enterprise-grade WAFs.",
      "Optimized parsing algorithms for Vector Database ingestion.",
    ],
  },
  {
    name: "CloudLens - Serverless Event Pipeline",
    tech: "Python, AWS Lambda, Terraform, Azure Functions",
    link: "github.com/chirag127/CloudLens-Serverless-Architecture",
    items: [
      "Designed an Event-Driven Architecture on AWS Lambda for high-volume media asset processing.",
      "Implemented Infrastructure as Code using Terraform across AWS and Azure.",
      "Integrated CloudWatch and Prometheus for full-stack observability.",
    ],
  },
  {
    name: "StreamGuard - Real-Time Fraud Analytics",
    tech: "Python, Kafka, Spark Streaming, PySpark",
    link: "github.com/chirag127/StreamGuard-Fraud-Detection",
    items: [
      "Architected a scalable streaming pipeline using Apache Kafka for 10k+ events per second.",
      "Developed PySpark microservices deployed on Kubernetes for fraud detection with sub-200ms latency.",
    ],
  },
  {
    name: "OmniPublish - Content Orchestration Engine",
    tech: "Python, System Design, Microservices, Node.js",
    link: "github.com/chirag127/OmniPublish-Platform",
    items: [
      "Architected a robust API Gateway using the Adapter Pattern to unify 17+ external platforms.",
      "Implemented Circuit Breaker patterns and asynchronous retry mechanisms for fault tolerance.",
    ],
  },
];

export const honors = [
  { title: "College Topper", description: "Rank 1 in Computer Science Engineering Batch (2020-2024)", location: "AKTU", year: "2024" },
  { title: "JEE Advanced", description: "Secured All India Rank 11870 (99th Percentile)", location: "India", year: "2020" },
  { title: "Meta Backend Developer", description: "Coursera Certification", location: "Online", year: "2023" },
  { title: "AWS Certified Developer", description: "Associate Level Certification", location: "Online", year: "2025" },
];

export const certifications = [
  "Meta Backend Developer Course (Coursera)",
  "AWS Certified Developer - Associate",
];

/**
 * Project Me - Resume Data
 * Strongly-typed Resume interface with all professional data
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
    name: "Chirag Singhal",
    firstName: "Chirag",
    lastName: "Singhal",
    position: "Software Engineer",
    tagline: "Backend & GenAI Specialist",
    location: "Bhubaneswar, Odisha, India",
    mobile: "(+91) 74284-49707",
    email: "hi@chirag127.in",
    github: "chirag127",
    linkedin: "chirag127",
    quote: "Building scalable systems at the intersection of Enterprise Engineering and Generative AI.",
  },
  summary: `Results-oriented Software Engineer with expertise in building scalable backend systems, AI-driven automation, and Microservices. Proficient in modern Python ecosystems (FastAPI, Flask) and Generative AI workflows (Agentic AI, RAG, Vector DBs). Experienced in optimizing enterprise-grade applications, reducing latency by 40%, and architecting event-driven data pipelines. A rapid learner and academic topper (JEE Advanced Rank Holder) seeking to leverage deep technical skills in System Design and AI to solve complex engineering challenges.`,
  skills: [
    {
      category: "Languages",
      skills: ["Python (Advanced)", "TypeScript/JavaScript", "SQL (PostgreSQL)", "Java", "C++"],
    },
    {
      category: "Generative AI & ML",
      skills: ["LangChain", "LangGraph (Agents)", "RAG Pipelines", "Hugging Face", "Vector DBs (Milvus/Chroma)", "PyTorch"],
    },
    {
      category: "Backend & Cloud",
      skills: ["FastAPI", "GraphQL", "Kafka", "Redis", "AWS (Lambda, EKS)", "Docker", "Kubernetes", "Terraform", "gRPC"],
    },
    {
      category: "Core Competencies",
      skills: ["System Design", "Event-Driven Architecture", "Microservices", "CI/CD", "Distributed Systems"],
    },
  ],
  experience: [
    {
      title: "Software Engineer",
      company: "Tata Consultancy Services (TCS)",
      location: "Bhubaneswar, India",
      startDate: "Jun. 2025",
      endDate: "Present",
      current: true,
      highlights: [
        "Optimized enterprise-scale pricing engines using Python, reducing quote generation latency by 60% for high-volume transactions.",
        "Architected modular data validation pipelines that bridge legacy XML-based systems with modern RESTful APIs, ensuring 100% data integrity across distributed systems.",
        "Implemented Automated CI/CD Workflows for code deployment, enforcing strict linting standards and reducing production rollback rates significantly.",
        "Designed responsive, dynamic UI components using JavaScript frameworks integrated with backend logic for real-time configuration updates.",
        "Collaborated in an Agile environment to refactor monolithic legacy scripts into maintainable, object-oriented Python modules.",
      ],
    },
    {
      title: "Software Developer (Full Stack)",
      company: "QRsay.com",
      location: "Remote, India",
      startDate: "Jul. 2023",
      endDate: "May 2025",
      current: false,
      highlights: [
        "Engineered the core backend for a high-traffic Food E-commerce platform using Python and MongoDB, handling thousands of concurrent requests.",
        "Implemented database performance tuning and indexing strategies, achieving a 40% reduction in API response times for critical dashboards.",
        "Developed real-time order processing systems and automated inventory synchronization across multiple kitchen outlets.",
        "Built secure payment gateway integrations and SMS notification services using robust third-party SDKs.",
      ],
    },
  ],
  projects: [
    {
      name: "NexusAI - Multi-Agent RAG Platform",
      techStack: ["Python", "LangGraph", "OpenAI", "Docker"],
      link: "github.com/chirag127/NexusAI-Agentic-Workflows",
      highlights: [
        "Architected an Agentic AI Platform using LangGraph that orchestrates multiple autonomous LLM agents to solve complex coding tasks.",
        "Implemented a Graph-based RAG pipeline using Neo4j and Vector Embeddings to provide high-precision context retrieval for enterprise documentation.",
        "Deployed the system on Kubernetes with auto-scaling capabilities to handle concurrent agent execution threads.",
      ],
    },
    {
      name: "TubeDigest - Multimodal Sponsor Detection",
      techStack: ["Python", "Transformers", "ONNX Runtime"],
      link: "github.com/chirag127/TubeDigest-AI-Sponsor-Block",
      highlights: [
        "Developed a high-performance AI engine to detect sponsor segments using Hugging Face Transformers and multimodal analysis (Audio + Text).",
        "Fine-tuned a T5 Model and optimized inference speed by 3x using ONNX Runtime and dynamic quantization techniques.",
        "Built a scalable Flask microservice to process real-time video streams with sub-second latency.",
      ],
    },
    {
      name: "Olivia - Edge AI Voice Assistant",
      techStack: ["Python", "Edge AI", "Llama-3"],
      link: "github.com/chirag127/Olivia-Voice-Assistant",
      highlights: [
        "Engineered a privacy-first Virtual Assistant utilizing Local LLMs (Llama-3) for intent classification and complex command execution.",
        "Implemented an Edge Computing architecture to process voice commands locally, eliminating cloud latency and ensuring offline functionality.",
        "Designed a plugin-based system enabling seamless integration with IoT devices and system automation scripts.",
      ],
    },
    {
      name: "Crawl4AI - Distributed RAG Ingestion",
      techStack: ["Python", "Redis", "Distributed Crawling"],
      link: "github.com/chirag127/Crawl4AI-LLM-Optimized-Web-Crawler",
      highlights: [
        "Designed a Distributed Web Crawler utilizing Redis Task Queues to ingest massive datasets for LLM training pipelines.",
        "Implemented intelligent stealth drivers and proxy rotation to bypass enterprise-grade WAFs and anti-bot protections.",
        "Optimized data parsing algorithms to convert unstructured HTML into structured JSON/Markdown for Vector Database ingestion.",
      ],
    },
    {
      name: "CloudLens - Serverless Event Pipeline",
      techStack: ["Python", "AWS Lambda", "Terraform"],
      link: "github.com/chirag127/CloudLens-Serverless-Architecture",
      highlights: [
        "Designed an Event-Driven Architecture on AWS Lambda to automatically process and categorize high-volume media assets.",
        "Implemented Infrastructure as Code (IaC) using Terraform to provision reproducible staging and production environments.",
        "Integrated CloudWatch and Prometheus for full-stack observability and automated alert handling.",
      ],
    },
    {
      name: "StreamGuard - Real-Time Fraud Analytics",
      techStack: ["Python", "Kafka", "Spark Streaming"],
      link: "github.com/chirag127/StreamGuard-Fraud-Detection",
      highlights: [
        "Architected a scalable streaming pipeline using Apache Kafka to ingest and process 10k+ transaction events per second.",
        "Developed PySpark microservices deployed on Kubernetes to detect fraud anomalies with sub-200ms end-to-end latency.",
      ],
    },
    {
      name: "OmniPublish - Content Orchestration Engine",
      techStack: ["Python", "System Design", "Microservices"],
      link: "github.com/chirag127/OmniPublish-Platform",
      highlights: [
        "Architected a robust API Gateway using the Adapter Pattern to unify 17+ external platforms (LinkedIn, Twitter) into a single interface.",
        "Implemented Circuit Breaker patterns and asynchronous retry mechanisms (Celery) to ensure fault tolerance across distributed APIs.",
      ],
    },
  ],
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "Dr. A.P.J. Abdul Kalam Technical University",
      location: "Lucknow, India",
      year: "Sep. 2020 - Jul. 2024",
      details: [
        "CGPA: 8.81 (Aggregate) | College Topper (Rank 1)",
        "Rank 1 in College Coding Competition (2022)",
      ],
    },
    {
      degree: "Senior Secondary (Class 12th) - CBSE",
      institution: "DDPS, Sanjay Nagar",
      location: "Ghaziabad, India",
      year: "2020",
      details: [
        "Percentage: 97% | School Topper (Rank 1)",
        "IIT JEE Advanced 2020: AIR 11870 (Top 1%)",
      ],
    },
  ],
  honors: [
    {
      title: "College Topper",
      description: "Rank 1 in Computer Science Engineering Batch (2020-2024)",
      organization: "AKTU",
      year: "2024",
    },
    {
      title: "JEE Advanced",
      description: "Secured All India Rank 11870 (99th Percentile)",
      organization: "India",
      year: "2020",
    },
    {
      title: "Certification",
      description: "Meta Backend Developer Course (Coursera)",
      organization: "Online",
      year: "2023",
    },
  ],
};

export default RESUME;

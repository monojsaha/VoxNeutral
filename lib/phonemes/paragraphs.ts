export interface ParagraphEntry {
  id: string;
  topic: string;
  title: string;
  text: string;
  targetWords: string[];
  difficulty: "intermediate" | "advanced" | "executive";
  wordCount: number;
}

export const PARAGRAPHS: ParagraphEntry[] = [
  // ── AI & Machine Learning ────────────────────────────────────────────────
  {
    id: "ai-001",
    topic: "AI & Machine Learning",
    title: "Generative AI Fundamentals",
    text: "Generative AI models leverage large neural networks trained on massive datasets to produce human-like text, images, and code. Organizations adopting these systems must address governance, hallucination risks, and responsible deployment strategies.",
    targetWords: ["generative", "neural", "governance", "hallucination", "deployment"],
    difficulty: "advanced",
    wordCount: 30,
  },
  {
    id: "ai-002",
    topic: "AI & Machine Learning",
    title: "Foundation Models in Production",
    text: "Foundation models are fine-tuned for specific enterprise use cases. The inference latency and throughput requirements vary significantly across production environments, making optimization a critical engineering discipline.",
    targetWords: ["inference", "latency", "throughput", "optimization", "enterprise"],
    difficulty: "advanced",
    wordCount: 29,
  },
  {
    id: "ai-003",
    topic: "AI & Machine Learning",
    title: "Retrieval-Augmented Generation",
    text: "Retrieval-augmented generation combines semantic vector embeddings with large language model inference to ground responses in verified enterprise knowledge, significantly reducing hallucination and improving factual accuracy.",
    targetWords: ["retrieval", "semantic", "vector", "embeddings", "inference", "hallucination"],
    difficulty: "executive",
    wordCount: 27,
  },
  {
    id: "ai-004",
    topic: "AI & Machine Learning",
    title: "AI Evaluation and Governance",
    text: "Robust AI governance requires deterministic evaluation pipelines that benchmark model performance against defined quality parameters before any production deployment, ensuring probabilistic outputs remain within acceptable risk thresholds.",
    targetWords: ["governance", "deterministic", "evaluation", "parameter", "probabilistic"],
    difficulty: "executive",
    wordCount: 28,
  },

  // ── Agentic AI ───────────────────────────────────────────────────────────
  {
    id: "agentic-001",
    topic: "Agentic AI",
    title: "Autonomous Agent Orchestration",
    text: "Agentic AI systems autonomously orchestrate multi-step workflows, interact with external tools, and adapt reasoning based on real-time feedback without constant human intervention, fundamentally changing enterprise automation strategies.",
    targetWords: ["agentic", "autonomous", "orchestration", "enterprise"],
    difficulty: "executive",
    wordCount: 28,
  },
  {
    id: "agentic-002",
    topic: "Agentic AI",
    title: "Agentic Pipeline Reliability",
    text: "Building reliable agentic pipelines requires careful attention to deterministic evaluation, error recovery strategies, and authorization boundaries that prevent unauthorized access to critical enterprise data and systems.",
    targetWords: ["agentic", "deterministic", "evaluation", "authorization", "enterprise"],
    difficulty: "advanced",
    wordCount: 27,
  },
  {
    id: "agentic-003",
    topic: "Agentic AI",
    title: "Multi-Agent Architecture",
    text: "Multi-agent architectures distribute reasoning across specialized autonomous agents coordinated by an orchestrator. Each agent handles a distinct capability, improving scalability, resilience, and overall system throughput.",
    targetWords: ["autonomous", "orchestration", "capability", "scalability", "resilience", "throughput"],
    difficulty: "executive",
    wordCount: 27,
  },

  // ── Software Architecture ────────────────────────────────────────────────
  {
    id: "arch-001",
    topic: "Software Architecture",
    title: "Microservices Complexity",
    text: "Microservices architecture improves scalability and deployment flexibility but introduces distributed system complexity, including service orchestration challenges, network latency overhead, and significant interoperability requirements between independently deployed components.",
    targetWords: ["microservices", "scalability", "distributed", "orchestration", "latency", "interoperability"],
    difficulty: "advanced",
    wordCount: 28,
  },
  {
    id: "arch-002",
    topic: "Software Architecture",
    title: "Domain-Driven Decomposition",
    text: "Domain-driven decomposition applies abstraction and encapsulation principles to reduce coupling and increase cohesion between software modules, resulting in architectures that are independently deployable and easier to refactor over time.",
    targetWords: ["decomposition", "abstraction", "encapsulation", "cohesion", "refactoring"],
    difficulty: "advanced",
    wordCount: 29,
  },
  {
    id: "arch-003",
    topic: "Software Architecture",
    title: "Event-Driven Resilience",
    text: "Event-driven architecture enables loose coupling through asynchronous message processing. Systems achieve higher resilience by decoupling producers from consumers, using idempotency guarantees to handle duplicate message delivery safely.",
    targetWords: ["asynchronous", "resilience", "idempotency", "distributed"],
    difficulty: "advanced",
    wordCount: 28,
  },

  // ── IT Infrastructure ────────────────────────────────────────────────────
  {
    id: "infra-001",
    topic: "IT Infrastructure",
    title: "Cloud Infrastructure Scalability",
    text: "Modern cloud infrastructure delivers on-demand scalability and availability by virtualizing compute resources across distributed data centers, enabling organizations to achieve measurable reliability improvements without capital infrastructure expenditure.",
    targetWords: ["infrastructure", "scalability", "availability", "distributed", "reliability"],
    difficulty: "advanced",
    wordCount: 28,
  },
  {
    id: "infra-002",
    topic: "IT Infrastructure",
    title: "Kubernetes Orchestration",
    text: "Kubernetes has become the de facto standard for container orchestration, enabling teams to automate containerization, manage distributed workloads, and maintain high availability across heterogeneous cloud infrastructure environments.",
    targetWords: ["kubernetes", "orchestration", "containerization", "distributed", "availability", "infrastructure"],
    difficulty: "advanced",
    wordCount: 27,
  },
  {
    id: "infra-003",
    topic: "IT Infrastructure",
    title: "Observability Engineering",
    text: "Observability engineering combines metrics, logs, and distributed tracing to give engineering teams deterministic insight into system behavior, reducing mean time to remediation and improving infrastructure reliability at scale.",
    targetWords: ["observability", "distributed", "deterministic", "remediation", "reliability", "infrastructure"],
    difficulty: "executive",
    wordCount: 28,
  },

  // ── Integration & APIs ───────────────────────────────────────────────────
  {
    id: "int-001",
    topic: "Integration & APIs",
    title: "Enterprise Integration Patterns",
    text: "Enterprise integration platforms synchronize data across heterogeneous systems using standardized protocols, schema validation, and idempotent payload processing to ensure reliable, consistent, and auditable data flows across the organization.",
    targetWords: ["enterprise", "synchronization", "protocol", "schema", "idempotency", "payload"],
    difficulty: "advanced",
    wordCount: 29,
  },
  {
    id: "int-002",
    topic: "Integration & APIs",
    title: "API-Led Connectivity",
    text: "API-led connectivity transforms legacy integration architecture by exposing reusable microservices through versioned, well-documented endpoints with proper authentication, authorization, and rate-limiting middleware governance policies.",
    targetWords: ["microservices", "versioning", "authentication", "authorization", "middleware", "governance"],
    difficulty: "advanced",
    wordCount: 26,
  },
  {
    id: "int-003",
    topic: "Integration & APIs",
    title: "Event Streaming and Webhooks",
    text: "Modern integration patterns combine webhook-based push notifications with event streaming to achieve near real-time data synchronization, eliminating polling overhead and reducing end-to-end latency across distributed enterprise systems.",
    targetWords: ["webhook", "synchronization", "latency", "distributed", "enterprise"],
    difficulty: "intermediate",
    wordCount: 29,
  },
  {
    id: "int-004",
    topic: "Integration & APIs",
    title: "Data Serialization Standards",
    text: "Effective API versioning depends on careful serialization strategy. Choosing between JSON schema validation and binary serialization formats directly affects interoperability, throughput, and the backward compatibility of distributed integrations.",
    targetWords: ["versioning", "serialization", "schema", "interoperability", "throughput", "distributed"],
    difficulty: "advanced",
    wordCount: 28,
  },

  // ── Solution Architecture ────────────────────────────────────────────────
  {
    id: "soln-001",
    topic: "Solution Architecture",
    title: "Architecture Capability Assessment",
    text: "A solution architect must translate complex business requirements into scalable technology blueprints, balancing capability maturity, vendor ecosystem constraints, and total cost of ownership throughout the engagement lifecycle.",
    targetWords: ["architecture", "scalability", "capability", "maturity", "engagement"],
    difficulty: "executive",
    wordCount: 27,
  },
  {
    id: "soln-002",
    topic: "Solution Architecture",
    title: "Digital Transformation Roadmap",
    text: "Digital transformation roadmaps require comprehensive assessment of infrastructure maturity, application rationalization priorities, and organizational capability readiness before committing resources to a large-scale modernization program.",
    targetWords: ["transformation", "assessment", "infrastructure", "rationalization", "capability", "maturity", "modernization"],
    difficulty: "executive",
    wordCount: 26,
  },
  {
    id: "soln-003",
    topic: "Solution Architecture",
    title: "Governance and Taxonomy",
    text: "Enterprise architecture governance establishes a shared taxonomy of capabilities, technology standards, and design principles that guide solution architects toward consistent, reusable patterns aligned with organizational strategy.",
    targetWords: ["governance", "enterprise", "taxonomy", "capability", "architecture"],
    difficulty: "executive",
    wordCount: 27,
  },

  // ── Presales & Revenue Growth ────────────────────────────────────────────
  {
    id: "pre-001",
    topic: "Presales & Revenue Growth",
    title: "Value Proposition Articulation",
    text: "An effective presales demonstration articulates differentiated value by connecting technical capabilities to specific client outcomes, addressing procurement objections while building credibility with technical and executive stakeholders simultaneously.",
    targetWords: ["demonstration", "articulation", "differentiation", "capability", "procurement", "stakeholder"],
    difficulty: "executive",
    wordCount: 28,
  },
  {
    id: "pre-002",
    topic: "Presales & Revenue Growth",
    title: "Revenue Growth Strategy",
    text: "Sustainable revenue growth in technology consulting depends on rigorous opportunity qualification, portfolio differentiation, and the ability to translate architecture capabilities into compelling, quantified value propositions for each client segment.",
    targetWords: ["revenue", "qualification", "portfolio", "differentiation", "capability", "proposition"],
    difficulty: "executive",
    wordCount: 29,
  },
  {
    id: "pre-003",
    topic: "Presales & Revenue Growth",
    title: "Commercialization of Innovation",
    text: "Successful commercialization of AI and cloud innovations requires aligning technical differentiation with procurement cycles, negotiating favorable enterprise agreements, and demonstrating measurable return on investment to multiple stakeholder groups.",
    targetWords: ["commercialization", "differentiation", "procurement", "negotiation", "enterprise", "stakeholder"],
    difficulty: "executive",
    wordCount: 28,
  },

  // ── IT Consulting ────────────────────────────────────────────────────────
  {
    id: "cons-001",
    topic: "IT Consulting",
    title: "Consulting Engagement Methodology",
    text: "A successful IT consulting engagement begins with a thorough diagnostic methodology, benchmarking current capabilities against industry standards, and delivering actionable remediation recommendations with quantified business impact.",
    targetWords: ["engagement", "methodology", "benchmarking", "capability", "remediation", "recommendation"],
    difficulty: "executive",
    wordCount: 27,
  },
  {
    id: "cons-002",
    topic: "IT Consulting",
    title: "Stakeholder Alignment in Transformation",
    text: "Winning technology transformation engagements requires consultants to demonstrate deep domain expertise, articulate a clear return on investment, and build stakeholder alignment across multiple organizational levels and governance committees.",
    targetWords: ["transformation", "engagement", "articulation", "stakeholder", "governance"],
    difficulty: "executive",
    wordCount: 28,
  },
  {
    id: "cons-003",
    topic: "IT Consulting",
    title: "Technology Rationalization",
    text: "Technology portfolio rationalization delivers measurable cost consolidation by systematically benchmarking application maturity, identifying redundant capabilities, and producing a prioritized modernization roadmap aligned with enterprise architecture governance principles.",
    targetWords: ["portfolio", "rationalization", "consolidation", "benchmarking", "maturity", "capability", "modernization", "governance"],
    difficulty: "executive",
    wordCount: 28,
  },
  {
    id: "cons-004",
    topic: "IT Consulting",
    title: "IT Sales Excellence",
    text: "IT sales excellence combines technical credibility with commercial acumen, enabling consultants to navigate complex procurement processes, negotiate enterprise agreements, and convert technical demonstrations into committed revenue pipeline.",
    targetWords: ["procurement", "enterprise", "negotiation", "demonstration", "revenue"],
    difficulty: "executive",
    wordCount: 27,
  },
];

export function getAllParagraphs(): ParagraphEntry[] {
  return PARAGRAPHS;
}

export function getParagraphsByTopic(topic: string): ParagraphEntry[] {
  return PARAGRAPHS.filter((p) => p.topic === topic);
}

export function getParagraphById(id: string): ParagraphEntry | undefined {
  return PARAGRAPHS.find((p) => p.id === id);
}

export function getTopics(): string[] {
  return [...new Set(PARAGRAPHS.map((p) => p.topic))];
}

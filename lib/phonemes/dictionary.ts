export interface PhonemeEntry {
  word: string;
  ipa: string;
  syllables: string[];
  stressIndex: number;
  acceptedVariants?: string[];
  domain?: string;
}

export const DICTIONARY: Record<string, PhonemeEntry> = {
  architecture: {
    word: "architecture",
    ipa: "/ˈɑːr.kɪ.tek.tʃər/",
    syllables: ["AR", "chi", "tec", "ture"],
    stressIndex: 0,
    domain: "engineering",
  },
  orchestration: {
    word: "orchestration",
    ipa: "/ˌɔːr.kɪˈstreɪ.ʃən/",
    syllables: ["or", "ches", "TRA", "tion"],
    stressIndex: 2,
    domain: "engineering",
  },
  observability: {
    word: "observability",
    ipa: "/əbˌzɜːr.və.bɪˈlɪ.ti/",
    syllables: ["ob", "ser", "va", "BIL", "i", "ty"],
    stressIndex: 3,
    domain: "engineering",
  },
  authentication: {
    word: "authentication",
    ipa: "/ɔːˌθen.tɪˈkeɪ.ʃən/",
    syllables: ["au", "then", "ti", "CA", "tion"],
    stressIndex: 3,
    domain: "security",
  },
  authorization: {
    word: "authorization",
    ipa: "/ˌɔː.θər.ɪˈzeɪ.ʃən/",
    syllables: ["au", "thor", "i", "ZA", "tion"],
    stressIndex: 3,
    domain: "security",
  },
  infrastructure: {
    word: "infrastructure",
    ipa: "/ˈɪn.frə.strʌk.tʃər/",
    syllables: ["IN", "fra", "struc", "ture"],
    stressIndex: 0,
    domain: "engineering",
  },
  scalability: {
    word: "scalability",
    ipa: "/ˌskeɪ.ləˈbɪl.ɪ.ti/",
    syllables: ["sca", "la", "BIL", "i", "ty"],
    stressIndex: 2,
    domain: "engineering",
  },
  availability: {
    word: "availability",
    ipa: "/əˌveɪ.ləˈbɪl.ɪ.ti/",
    syllables: ["a", "vail", "a", "BIL", "i", "ty"],
    stressIndex: 3,
    domain: "engineering",
  },
  reliability: {
    word: "reliability",
    ipa: "/rɪˌlaɪ.əˈbɪl.ɪ.ti/",
    syllables: ["re", "li", "a", "BIL", "i", "ty"],
    stressIndex: 3,
    domain: "engineering",
  },
  interoperability: {
    word: "interoperability",
    ipa: "/ˌɪn.tər.ˌɒp.ər.əˈbɪl.ɪ.ti/",
    syllables: ["in", "ter", "op", "er", "a", "BIL", "i", "ty"],
    stressIndex: 5,
    domain: "engineering",
  },
  resilience: {
    word: "resilience",
    ipa: "/rɪˈzɪl.i.əns/",
    syllables: ["re", "SIL", "ience"],
    stressIndex: 1,
    domain: "engineering",
  },
  autonomous: {
    word: "autonomous",
    ipa: "/ɔːˈtɒn.ə.məs/",
    syllables: ["au", "TON", "o", "mous"],
    stressIndex: 1,
    domain: "ai",
  },
  generative: {
    word: "generative",
    ipa: "/ˈdʒen.ər.ə.tɪv/",
    syllables: ["GEN", "er", "a", "tive"],
    stressIndex: 0,
    domain: "ai",
  },
  deterministic: {
    word: "deterministic",
    ipa: "/dɪˌtɜːr.mɪˈnɪs.tɪk/",
    syllables: ["de", "ter", "mi", "NIS", "tic"],
    stressIndex: 3,
    domain: "ai",
  },
  probabilistic: {
    word: "probabilistic",
    ipa: "/ˌprɒb.ə.bɪˈlɪs.tɪk/",
    syllables: ["prob", "a", "bi", "LIS", "tic"],
    stressIndex: 3,
    domain: "ai",
  },
  artificial: {
    word: "artificial",
    ipa: "/ˌɑːr.tɪˈfɪʃ.əl/",
    syllables: ["ar", "ti", "FI", "cial"],
    stressIndex: 2,
    domain: "ai",
  },
  intelligence: {
    word: "intelligence",
    ipa: "/ɪnˈtel.ɪ.dʒəns/",
    syllables: ["in", "TEL", "li", "gence"],
    stressIndex: 1,
    domain: "ai",
  },
  kubernetes: {
    word: "kubernetes",
    ipa: "/ˌkuː.bərˈneɪ.tɪz/",
    syllables: ["ku", "ber", "NEY", "tes"],
    stressIndex: 2,
    domain: "devops",
    acceptedVariants: ["koo-ber-NEY-tes"],
  },
  containerization: {
    word: "containerization",
    ipa: "/kənˌteɪ.nər.ɪˈzeɪ.ʃən/",
    syllables: ["con", "tain", "er", "i", "ZA", "tion"],
    stressIndex: 4,
    domain: "devops",
  },
  microservices: {
    word: "microservices",
    ipa: "/ˈmaɪ.kroʊˌsɜːr.vɪsɪz/",
    syllables: ["MI", "cro", "ser", "vi", "ces"],
    stressIndex: 0,
    domain: "devops",
  },
  hallucination: {
    word: "hallucination",
    ipa: "/həˌluː.sɪˈneɪ.ʃən/",
    syllables: ["hal", "lu", "ci", "NA", "tion"],
    stressIndex: 3,
    domain: "ai",
  },
  governance: {
    word: "governance",
    ipa: "/ˈɡʌv.ər.nəns/",
    syllables: ["GOV", "er", "nance"],
    stressIndex: 0,
    domain: "leadership",
  },
  implementation: {
    word: "implementation",
    ipa: "/ˌɪm.plɪ.menˈteɪ.ʃən/",
    syllables: ["im", "ple", "men", "TA", "tion"],
    stressIndex: 3,
    domain: "engineering",
  },
  transformation: {
    word: "transformation",
    ipa: "/ˌtræns.fərˈmeɪ.ʃən/",
    syllables: ["trans", "for", "MA", "tion"],
    stressIndex: 2,
    domain: "leadership",
  },
  modernization: {
    word: "modernization",
    ipa: "/ˌmɒd.ər.naɪˈzeɪ.ʃən/",
    syllables: ["mod", "ern", "i", "ZA", "tion"],
    stressIndex: 3,
    domain: "leadership",
  },
  vulnerability: {
    word: "vulnerability",
    ipa: "/ˌvʌl.nər.əˈbɪl.ɪ.ti/",
    syllables: ["vul", "ner", "a", "BIL", "i", "ty"],
    stressIndex: 3,
    domain: "security",
  },
  idempotency: {
    word: "idempotency",
    ipa: "/ˌaɪ.dəmˈpoʊ.tən.si/",
    syllables: ["i", "dem", "PO", "ten", "cy"],
    stressIndex: 2,
    domain: "engineering",
  },
  asynchronous: {
    word: "asynchronous",
    ipa: "/eɪˈsɪŋ.krə.nəs/",
    syllables: ["a", "SYN", "chro", "nous"],
    stressIndex: 1,
    domain: "engineering",
  },
  technology: {
    word: "technology",
    ipa: "/tekˈnɒl.ə.dʒi/",
    syllables: ["tech", "NOL", "o", "gy"],
    stressIndex: 1,
    domain: "general",
  },
  algorithm: {
    word: "algorithm",
    ipa: "/ˈæl.ɡə.rɪ.ðəm/",
    syllables: ["AL", "go", "ri", "thm"],
    stressIndex: 0,
    domain: "ai",
  },
};

export function lookupWord(word: string): PhonemeEntry | undefined {
  return DICTIONARY[word.toLowerCase()];
}

export function getAllWords(): PhonemeEntry[] {
  return Object.values(DICTIONARY).sort((a, b) => a.word.localeCompare(b.word));
}

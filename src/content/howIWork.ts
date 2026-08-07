import type { HowIWorkStepEntry } from './types';

/** Process steps rendered by the `HowIWork` section as flip cards. */
export const HOW_I_WORK_STEPS: HowIWorkStepEntry[] = [
  {
    id: 1,
    locales: {
      pt: {
        title: 'Entender',
        description:
          'Começo entendendo o <strong>problema e o contexto</strong>, antes de pensar em soluções',
        tools: ['Entrevistas', 'Workshops', 'Análise de dados'],
        process: ['Objetivos', 'Restrições', 'KPIs'],
      },
      en: {
        title: 'Understand',
        description:
          'I start by understanding the <strong>problem and context</strong>, before thinking about solutions',
        tools: ['User Interviews', 'Stakeholder Workshops', 'Data Analysis'],
        process: ['Define Goals', 'Map Constraints', 'Identify KPIs'],
      },
    },
  },
  {
    id: 2,
    locales: {
      pt: {
        title: 'Pesquisar',
        description:
          'Uso <strong>pesquisa com usuários e dados</strong> para embasar decisões de produto',
        tools: ['Benchmarking', 'Desk Research', 'Questionários'],
        process: ['Análise competitiva', 'Personas', 'Mapeamento de jornada'],
      },
      en: {
        title: 'Research',
        description:
          'I use <strong>user research and data</strong> to base product decisions',
        tools: ['Benchmark', 'Desk Research', 'Surveys'],
        process: ['Competitor Analysis', 'User Personas', 'Journey Mapping'],
      },
    },
  },
  {
    id: 3,
    locales: {
      pt: {
        title: 'Definir',
        description:
          'Traduzo necessidades em <strong>requisitos claros, fluxos e arquitetura da informação</strong>',
        tools: ['Miro', 'FigJam', 'Fluxogramas'],
        process: ['User Flows', 'Sitemaps', 'Requisitos'],
      },
      en: {
        title: 'Define',
        description:
          'I translate needs into <strong>clear requirements, flows and information architecture</strong>',
        tools: ['Miro', 'FigJam', 'Flowcharts'],
        process: ['User Flows', 'Sitemaps', 'Requirement Doc'],
      },
    },
  },
  {
    id: 4,
    locales: {
      pt: {
        title: 'Prototipar',
        description:
          'Prototipo e valido soluções de forma <strong>iterativa</strong>, com testes e feedback real',
        tools: ['Figma', 'Protopie', 'Testes de usabilidade'],
        process: ['Wireframing', 'Protótipos', 'Testes validação'],
      },
      en: {
        title: 'Prototype',
        description:
          'I prototype and validate solutions <strong>iteratively</strong>, with tests and real feedback',
        tools: ['Figma', 'Protopie', 'Usability Hub'],
        process: ['Wireframing', 'Interactive Prototypes', 'Usability Testing'],
      },
    },
  },
  {
    id: 5,
    locales: {
      pt: {
        title: 'Colaborar',
        description:
          'Trabalho de forma próxima com <strong>desenvolvedores e stakeholders</strong>, facilitando alinhamentos',
        tools: ['Jira', 'Notion', 'Slack'],
        process: ['Handoff', 'Suporte a QA', 'Design Review'],
      },
      en: {
        title: 'Collaborate',
        description:
          'I work closely with <strong>developers and stakeholders</strong>, facilitating alignment',
        tools: ['Jira', 'Notion', 'Slack'],
        process: ['Design Handoff', 'QA Support', 'Design Review'],
      },
    },
  },
  {
    id: 6,
    locales: {
      pt: {
        title: 'Documentar',
        description:
          'Registro decisões e aprendizados para garantir <strong>clareza, consistência e escala</strong>',
        tools: ['Design System', 'Documentação', 'Loom'],
        process: ['Guias de estilo', 'Biblioteca', 'Post-mortem'],
      },
      en: {
        title: 'Document',
        description:
          'I register decisions and learnings to ensure <strong>clarity, consistency and scale</strong>',
        tools: ['Design System', 'Documentation', 'Loom'],
        process: ['Style Guides', 'Pattern Library', 'Post-mortem'],
      },
    },
  },
];

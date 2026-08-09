import type { HowIWorkStepEntry } from './types';

export const HOW_I_WORK_STEPS: HowIWorkStepEntry[] = [
  {
    id: 1,
    locales: {
      pt: {
        title: 'Entender',
        description:
          'Antes de pensar em soluções, procuro compreender o <strong>contexto, os objetivos do negócio, as necessidades dos usuários e as restrições técnicas</strong>.',
        tools: ['Jira', 'Confluence', 'Miro'],
        practices: [
          'Alinhamento com stakeholders',
          'Levantamento de requisitos',
          'Definição de objetivos',
        ],
      },
      en: {
        title: 'Understand',
        description:
          'Before thinking about solutions, I seek to understand the <strong>context, business goals, user needs and technical constraints</strong>.',
        tools: ['Jira', 'Confluence', 'Miro'],
        practices: ['Stakeholder alignment', 'Requirements gathering', 'Goal definition'],
      },
    },
  },
  {
    id: 2,
    locales: {
      pt: {
        title: 'Descobrir Insights',
        description:
          'Quando o desafio exige, utilizo <strong>pesquisas com usuários, análise de dados e benchmarking</strong> para reduzir suposições e embasar decisões. Acredito que boas soluções começam com uma boa compreensão das pessoas.',
        tools: ['Miro', 'ChatGPT', 'Google Forms'],
        practices: [
          'Entrevistas com usuários',
          'Benchmarking',
          'Síntese de aprendizados',
        ],
      },
      en: {
        title: 'Discover Insights',
        description:
          'When the challenge calls for it, I use <strong>user research, data analysis and benchmarking</strong> to reduce assumptions and support better decisions. I believe great solutions start with a deep understanding of people.',
        tools: ['Miro', 'ChatGPT', 'Google Forms'],
        practices: ['User interviews', 'Benchmarking', 'Insight synthesis'],
      },
    },
  },
  {
    id: 3,
    locales: {
      pt: {
        title: 'Explorar Possibilidades',
        description:
          'Exploro diferentes possibilidades utilizando <strong>IA como apoio para acelerar a ideação, desafiar hipóteses e ampliar alternativas</strong> antes de partir para a execução.',
        tools: ['Figma Make', 'ChatGPT', 'FigJam'],
        practices: [
          'Exploração de ideias',
          'Exploração com IA',
          'Refinamento de soluções',
        ],
      },
      en: {
        title: 'Explore Possibilities',
        description:
          'I explore different possibilities using <strong>AI as a partner to accelerate ideation, challenge assumptions and expand alternatives</strong> before moving into execution.',
        tools: ['Figma Make', 'ChatGPT', 'FigJam'],
        practices: ['Idea exploration', 'AI-assisted exploration', 'Solution refinement'],
      },
    },
  },
  {
    id: 4,
    locales: {
      pt: {
        title: 'Projetar',
        description:
          'Transformo ideias em <strong>interfaces escaláveis</strong> utilizando Design System, componentização e protótipos iterativos para equilibrar velocidade, consistência e qualidade.',
        tools: ['Figma', 'Figma Make', 'Design System'],
        practices: ['Componentização', 'Prototipação iterativa', 'Consistência visual'],
      },
      en: {
        title: 'Design',
        description:
          'I transform ideas into <strong>scalable interfaces</strong> using Design Systems, reusable components and iterative prototyping to balance speed, consistency and quality.',
        tools: ['Figma', 'Figma Make', 'Design System'],
        practices: [
          'Component-based design',
          'Iterative prototyping',
          'Visual consistency',
        ],
      },
    },
  },
  {
    id: 5,
    locales: {
      pt: {
        title: 'Validar',
        description:
          'Valido soluções continuamente com <strong>stakeholders e desenvolvedores</strong>, acompanhando a implementação para garantir que a experiência planejada seja entregue.',
        tools: ['Jira', 'Confluence', 'Figma'],
        practices: ['Handoff', 'QA funcional', 'Testes de responsividade'],
      },
      en: {
        title: 'Validate',
        description:
          'I continuously validate solutions with <strong>stakeholders and developers</strong>, following implementation closely to ensure the intended experience is delivered.',
        tools: ['Jira', 'Confluence', 'Figma'],
        practices: ['Design handoff', 'Functional QA', 'Responsive testing'],
      },
    },
  },
  {
    id: 6,
    locales: {
      pt: {
        title: 'Evoluir',
        description:
          'Registro decisões, compartilho conhecimento e transformo aprendizados em <strong>melhorias contínuas para o produto e para o time</strong>.',
        tools: ['Confluence', 'Notion', 'Jira'],
        practices: [
          'Documentação',
          'Compartilhamento de conhecimento',
          'Melhoria contínua',
        ],
      },
      en: {
        title: 'Evolve',
        description:
          'I document decisions, share knowledge and turn learnings into <strong>continuous improvements for both the product and the team</strong>.',
        tools: ['Confluence', 'Notion', 'Jira'],
        practices: ['Documentation', 'Knowledge sharing', 'Continuous improvement'],
      },
    },
  },
];

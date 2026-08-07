import type { ExperienceEntry } from './types';

/**
 * Work history.
 *
 * Dates are calendar months (`YYYY-MM`) and are formatted with a pinned UTC
 * timezone - see `utils/date.ts` for why. Identity fields are declared once;
 * only role/description/highlights are localized.
 */
export const EXPERIENCES: ExperienceEntry[] = [
  {
    id: 1,
    company: 'Kiwano Tecnologia',
    startDate: '2023-12',
    locales: {
      pt: {
        role: 'Product Designer',
        description:
          'Product Designer de ponta a ponta trabalhando do discovery à entrega, colaborando estreitamente com equipes multidisciplinares para alinhar necessidades do usuário, metas de negócios e restrições técnicas.',
        highlights: [
          'Liderei pesquisas com usuários, entrevistas com stakeholders e testes de usabilidade, traduzindo insights em soluções de produto validadas.',
          'Conduzi análises de mercado e concorrentes para identificar oportunidades de produto e influenciar decisões de roadmap.',
          'Desenhei interfaces de alta fidelidade, protótipos interativos e documentação de UX para apoiar equipes de engenharia e produto.',
          'Colaborei estreitamente com desenvolvedores durante a implementação e QA para garantir consistência de design e usabilidade.',
          'Contribuí para o lançamento de múltiplos produtos, incluindo um aplicativo móvel de rastreamento veicular e uma plataforma de agendamento de treinamento profissional.',
        ],
      },
      en: {
        role: 'Product Designer',
        description:
          'End-to-end product designer working from discovery to delivery, closely collaborating with multidisciplinary teams to align user needs, business goals, and technical constraints.',
        highlights: [
          'Led user research, stakeholder interviews, and usability testing, translating insights into validated product solutions.',
          'Conducted market and competitor analysis to identify product opportunities and influence roadmap decisions.',
          'Designed high-fidelity interfaces, interactive prototypes, and UX documentation to support engineering and product teams.',
          'Collaborated closely with developers during implementation and QA to ensure design consistency and usability.',
          'Contributed to the launch of multiple products, including a vehicle tracking mobile app and a professional training scheduling platform.',
        ],
      },
    },
  },
  {
    id: 2,
    company: 'Kiwano Tecnologia',
    startDate: '2024-01',
    endDate: '2024-12',
    locales: {
      pt: {
        role: 'Product Designer — Projeto: New Maps',
        description:
          'Liderei o redesign e unificação dos sistemas de navegação móvel entre Android e iOS em uma única arquitetura escalável em Flutter.',
        highlights: [
          'Unifiquei a navegação Android e iOS em uma única arquitetura baseada em Flutter, reduzindo o total de telas em ~32%.',
          'Reduzi a profundidade média de navegação de 5 para 3 níveis, melhorando a eficiência das tarefas em fluxos críticos.',
          'Simplifiquei fluxos principais do produto (relatórios, comandos, ações do mapa), reduzindo etapas de interação em até 50%.',
          'Eliminei 100% dos fluxos duplicados entre plataformas consolidando experiências em padrões escaláveis do Flutter.',
          'Padronizei padrões de navegação entre plataformas, reduzindo interações inconsistentes em ~70%.',
          'Otimizei a arquitetura de informação para suportar escalabilidade futura de recursos e ciclos de desenvolvimento mais rápidos.',
        ],
      },
      en: {
        role: 'Product Designer — Project: New Maps',
        description:
          'Led the redesign and unification of mobile navigation systems across Android and iOS into a single scalable Flutter architecture.',
        highlights: [
          'Unified Android and iOS navigation into a single Flutter-based architecture, reducing total screens by ~32%.',
          'Reduced average navigation depth from 5 to 3 levels, improving task efficiency in critical flows.',
          'Simplified core product flows (reports, commands, map actions), cutting interaction steps by up to 50%.',
          'Eliminated 100% of duplicated flows between platforms by consolidating experiences into scalable Flutter patterns.',
          'Standardized navigation patterns across platforms, reducing inconsistent interactions by ~70%.',
          'Optimized information architecture to support future feature scalability and faster development cycles.',
        ],
      },
    },
  },
  {
    id: 3,
    company: 'DBV Pioneiros do Paraná',
    startDate: '2022-04',
    endDate: '2022-06',
    locales: {
      pt: {
        role: 'UX Designer & UX Researcher',
        description:
          'UX Designer and Researcher trabalhando com uma organização de impacto social para melhorar processos operacionais e gestão de informações.',
        highlights: [
          'Identifiquei lacunas operacionais críticas através de entrevistas em profundidade e desk research com voluntários e coordenadores.',
          'Sintetizei insights de pesquisa em decisões claras de design focadas em organização, rastreabilidade e continuidade.',
          'Desenhei e entreguei um sistema de ponta a ponta para registrar, organizar e manter históricos de atividades para crianças e adolescentes.',
          'Reduzi a dependência de processos informais e manuais, melhorando a acessibilidade das informações a longo prazo.',
          'Entreguei uma solução híbrida escalável (digital + materiais impressos) alinhada com fluxos de trabalho do mundo real.',
        ],
      },
      en: {
        role: 'UX Designer & UX Researcher',
        description:
          'UX Designer and Researcher working with a social impact organization to improve operational processes and information management.',
        highlights: [
          'Identified critical operational gaps through in-depth interviews and desk research with volunteers and coordinators.',
          'Synthesized research insights into clear design decisions focused on organization, traceability, and continuity.',
          'Designed and delivered an end-to-end system to register, organize, and maintain activity histories for children and adolescents.',
          'Reduced reliance on informal and manual processes, improving long-term information accessibility.',
          'Delivered a scalable hybrid solution (digital + printed materials) aligned with real-world workflows.',
        ],
      },
    },
  },
];

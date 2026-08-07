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
    company: 'Tata Consultancy Services',
    startDate: '2026-02',
    locales: {
      pt: {
        role: 'Product Designer — Conta Pfizer',
        description:
          'Product Designer principal em uma equipe de saúde digital da Pfizer, responsável por experiências web complexas desde o levantamento de requisitos e prototipação até o handoff para engenharia e validação funcional.',
        highlights: [
          'Desenho e aprimoro dashboards operacionais, ferramentas de agendamento, funcionalidades de gestão de equipes, fluxos de autenticação e experiências relacionadas a pacientes.',
          'Colaboro diretamente com Product Owner, stakeholders de negócio e engenheiros para esclarecer requisitos, apresentar decisões de design e entregar melhorias incrementais no produto.',
          'Introduzo práticas de pesquisa com usuários na equipe, incluindo o planejamento do primeiro teste de usabilidade com protótipos interativos para apoiar decisões de produto baseadas em evidências.',
          'Utilizo Figma Make para acelerar a exploração de interfaces e iteração de componentes, e Rovo para apoiar escrita, análise de requisitos, comunicação e pensamento estratégico.',
          'Mantenho documentação de produto e rastreabilidade das entregas através de Jira e Confluence, além de validar novas funcionalidades antes do lançamento.',
        ],
      },
      en: {
        role: 'Product Designer — Pfizer Account',
        description:
          'Primary Product Designer for a Pfizer digital healthcare team, owning complex web experiences from requirements and prototyping through engineering handoff and functional validation.',
        highlights: [
          'Design and improve operational dashboards, scheduling tools, team-management features, authentication flows, and patient-related workflows.',
          'Collaborate directly with the Product Owner, business stakeholders, and engineers to clarify requirements, present design decisions, and deliver incremental product improvements.',
          'Introduce user research practices to the team, including planning its first usability test with interactive prototypes to support evidence-based product decisions.',
          'Use Figma Make to accelerate interface exploration and component iteration, and Rovo to support writing, requirements analysis, communication, and strategic thinking.',
          'Maintain product documentation and delivery traceability through Jira and Confluence while validating new features before release.',
        ],
      },
    },
  },
  {
    id: 2,
    company: 'Kiwano Tecnologia',
    startDate: '2023-12',
    endDate: '2026-02',
    locales: {
      pt: {
        role: 'Product Designer',
        description:
          'Product Designer de ponta a ponta, atuando do discovery à entrega e alinhando necessidades dos usuários, objetivos de negócio e restrições técnicas em colaboração com equipes multidisciplinares.',
        highlights: [
          'Conduzi pesquisas com usuários, entrevistas com stakeholders e testes de usabilidade, transformando insights em soluções validadas e reduzindo retrabalho durante o desenvolvimento.',
          'Realizei análises de mercado e concorrentes para identificar lacunas e oportunidades de melhoria, influenciando diretamente a estratégia e o roadmap dos produtos.',
          'Desenhei interfaces de alta fidelidade e protótipos interativos, além de produzir documentação de UX, diagramas e mockups para acelerar decisões e melhorar o handoff entre design e engenharia.',
          'Colaborei diretamente com desenvolvedores durante implementação e QA para garantir consistência de design, usabilidade e entregas dentro dos prazos.',
          'Contribuí para o lançamento de múltiplos produtos, incluindo um aplicativo móvel de rastreamento veicular e uma plataforma de agendamento de treinamentos profissionais, com forte foco em usabilidade e satisfação dos usuários.',
        ],
      },
      en: {
        role: 'Product Designer',
        description:
          'End-to-end Product Designer working from discovery to delivery, aligning user needs, business goals, and technical constraints across cross-functional teams.',
        highlights: [
          'Conducted user research, stakeholder interviews, and usability testing, translating insights into validated solutions and reducing rework during development.',
          'Conducted market and competitive analysis to identify product gaps and opportunities for improvement, directly influencing product strategy and roadmap decisions.',
          'Designed high-fidelity interfaces and interactive prototypes, producing UX documentation, diagrams, and mockups that accelerated decision-making and improved design-to-engineering handoff efficiency.',
          'Collaborated closely with developers throughout implementation and QA to ensure design consistency, usability, and on-time delivery.',
          'Contributed to the launch of multiple products, including a vehicle tracking mobile app and a professional training scheduling platform, with a strong focus on usability and user satisfaction.',
        ],
      },
    },
  },
  {
    id: 3,
    company: 'Kiwano Tecnologia',
    startDate: '2024-01',
    endDate: '2024-12',
    locales: {
      pt: {
        role: 'Product Designer — Projeto: New Maps',
        description:
          'Liderei a unificação dos sistemas de navegação Android e iOS em uma única arquitetura Flutter, reduzindo a complexidade de UX e manutenção e criando uma experiência consistente e escalável entre plataformas.',
        highlights: [
          'Unifiquei a navegação Android e iOS em uma única arquitetura Flutter, reduzindo o número total de telas em aproximadamente 32%.',
          'Desenhei um sistema de navegação unificado entre plataformas que reduziu a profundidade média de navegação de 5 para 3 níveis, aumentando a eficiência em fluxos críticos.',
          'Simplifiquei fluxos principais do produto, incluindo relatórios, comandos e ações do mapa, reduzindo em até 50% o número de etapas em interações frequentes.',
          'Eliminei 100% dos fluxos duplicados entre Android e iOS ao consolidá-los em experiências Flutter escaláveis e parametrizadas.',
          'Padronizei os padrões de navegação entre plataformas, reduzindo modelos de interação inconsistentes em aproximadamente 70% e melhorando usabilidade e facilidade de aprendizado.',
          'Otimizei a arquitetura de informação para suportar a escalabilidade de novas funcionalidades, ciclos de desenvolvimento mais rápidos e uma experiência consistente entre plataformas.',
        ],
      },
      en: {
        role: 'Product Designer — Project: New Maps',
        description:
          'Led the unification of Android and iOS navigation systems into a single Flutter architecture, reducing UX and maintenance complexity while creating a consistent and scalable cross-platform experience.',
        highlights: [
          'Led the unification of Android and iOS navigation into a single Flutter architecture, reducing the total number of screens by ~32%.',
          'Designed a unified cross-platform navigation system that cut average navigation depth from 5 to 3 levels, improving task efficiency across critical user flows.',
          'Simplified core product flows, including reports, commands, and map actions, reducing user steps by up to 50% in high-frequency interactions.',
          'Eliminated 100% of duplicated Android and iOS flows by consolidating them into scalable, parameterized Flutter experiences.',
          'Standardized navigation patterns across platforms, reducing inconsistent interaction models by an estimated 70% and improving usability and learnability.',
          'Optimized information architecture to support future feature scalability, enabling faster development cycles and consistent UX delivery across platforms.',
        ],
      },
    },
  },
  {
    id: 4,
    company: 'DBV Pioneiros do Paraná',
    startDate: '2022-04',
    endDate: '2022-06',
    locales: {
      pt: {
        role: 'UX Designer & UX Researcher',
        description:
          'UX Designer e Researcher em uma organização de impacto social, trabalhando na melhoria de processos operacionais, organização de informações e continuidade dos registros de atividades.',
        highlights: [
          'Identifiquei lacunas operacionais críticas através de entrevistas em profundidade e desk research com voluntários e coordenadores.',
          'Sintetizei insights de pesquisa em decisões claras de design, com foco em organização, rastreabilidade e continuidade dos registros de atividades.',
          'Desenhei e entreguei um sistema de ponta a ponta para registrar, organizar e manter o histórico de atividades realizadas com crianças e adolescentes.',
          'Reduzi a dependência de processos informais e manuais, melhorando a organização das informações e sua acessibilidade de longo prazo para os voluntários.',
          'Entreguei uma solução híbrida escalável, combinando recursos digitais e materiais impressos, alinhada aos fluxos reais dos voluntários e preparada para uso contínuo.',
        ],
      },
      en: {
        role: 'UX Designer & UX Researcher',
        description:
          'UX Designer and Researcher working with a social impact organization to improve operational processes, information organization, and continuity of activity records.',
        highlights: [
          'Identified critical operational gaps through in-depth interviews and desk research with volunteers and coordinators.',
          'Synthesized research insights into clear design decisions, focusing on organization, traceability, and continuity of activity records.',
          'Designed and delivered an end-to-end system to register, organize, and maintain historical records of activities with children and adolescents.',
          'Reduced reliance on informal and manual processes, improving information organization and long-term accessibility for volunteers.',
          'Delivered a scalable hybrid solution combining digital and printed materials that supported real-world volunteer workflows and enabled continuous use.',
        ],
      },
    },
  },
];
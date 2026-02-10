import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        // Placeholders for now
        title: 'Nathália Moratto Caldeira',
        role: 'Product Designer | UX researcher, UX designer, QA',
        manifest: 'DESIGN AS A DECISION TOOL\nfor clear, usable and sustainable products',
        about: {
          title: 'About Me',
          mainText:
            'I am a <strong>Product Designer</strong> with over <strong>2 years of experience</strong> working end-to-end in digital product development, from <strong>discovery to delivery</strong>, in medium and high complexity contexts.\n\nCurrently working at <strong>Kiwano Tecnologia</strong>, actively participating in product decisions and collaborating closely with developers and stakeholders to build solutions based on <strong>user research, usability testing and market analysis</strong>.\n\nI focus on <strong>information architecture, requirements definition, designing complex flows and high-fidelity prototyping</strong>. I have worked on products such as vehicle tracking mobile apps and scheduling platforms, always seeking to <strong>simplify flows, increase clarity and ensure scalability</strong>.\n\nI am motivated by solving <strong>real product problems</strong>, making well-founded decisions and building solutions that are <strong>clear, usable and sustainable over time</strong>.',
          education: {
            title: 'Professional Formation',
            item1:
              'Post-graduate <strong>User Experience and Beyond</strong>. PUCRS — <em>Ongoing</em>',
            item2:
              '<strong>Google UX Design Professional Certificate</strong>. Google — Coursera',
            item3: '<strong>Bachelor of Law</strong>. Faculdade Pitágoras',
          },
          courses: {
            title: 'Complementary Courses',
            item1:
              'Course “Create High-Fidelity Designs and Prototypes in Figma”. Google — Coursera',
            item2:
              'Course “Conduct UX Research and Test Early Concepts”. Google — Coursera',
            item3: '<strong>User Experience</strong>. FIAP',
          },
          tools: {
            title: 'Tools',
            research: 'Research & Validation',
            collaboration: 'Collaboration & Ideation',
            management: 'Management & Documentation',
            design: 'Design & Prototyping',
          },
          competencies: {
            title: 'Competencies',
            productOrUx: 'Product & UX Competencies',
            process: 'Process Competencies',
            items: {
              research: 'Research and discovery',
              definition: 'Problem definition and requirements',
              ia: 'Information architecture and flows',
              prototyping: 'Prototyping and validation',
              collaboration: 'Collaboration and communication',
              data: 'Data-driven decision',
              empathy: 'Active listening and empathy',
              planning: 'Planning and documentation',
              delivery: 'Delivery in complex contexts',
            },
          },
          beyondWork: {
            title: 'Beyond Work',
            text: 'I act as a <strong>choir conductor</strong>, an experience that reinforces my ability to <strong>lead groups, organize processes, listen to different voices and lead people towards a common goal</strong>.\n\nApart from that, I like playing the piano, spending time with family playing board games and enjoying quieter moments reading a good book or watching a series with my husband.',
          },
        },
        nav: {
          home: 'Home',
          about: 'About',
          skills: 'Skills',
          experience: 'Experience',
          projects: 'Projects',
          contact: 'Contact',
        },
        howIWork: {
          title: 'How I Work',
          step1:
            'I start by understanding the <strong>problem and context</strong>, before thinking about solutions',
          step2:
            'I use <strong>user research and data</strong> to base product decisions',
          step3:
            'I translate needs into <strong>clear requirements, flows and information architecture</strong>',
          step4:
            'I prototype and validate solutions <strong>iteratively</strong>, with tests and real feedback',
          step5:
            'I work closely with <strong>developers and stakeholders</strong>, facilitating alignment',
          step6:
            'I register decisions and learnings to ensure <strong>clarity, consistency and scale</strong>',
        },
        projects: {
          comingSoon: 'Coming soon',
          laneToggle: {
            label: 'View',
            fast: 'Fast',
            slow: 'Slow',
            ariaLabel: 'Choose lane: currently {{current}}',
            liveRegion: 'Lane changed to {{lane}}',
          },
          metadata: {
            role: 'Role',
            platform: 'Platform',
            designTools: 'Design tools',
          },
        },
      },
    },
    pt: {
      translation: {
        title: 'Nathália Moratto Caldeira',
        role: 'Product Designer | UX researcher, UX designer, QA',
        manifest:
          'DESIGN COMO FERRAMENTA DE DECISÃO\npara produtos claros, usáveis e sustentáveis',
        about: {
          title: 'Sobre',
          mainText:
            'Sou <strong>Product Designer</strong> com mais de <strong>2 anos de experiência</strong> atuando de ponta a ponta no desenvolvimento de produtos digitais, do <strong>discovery à entrega</strong>, em contextos de média e alta complexidade.\n\nAtualmente atuo na <strong>Kiwano Tecnologia</strong>, participando ativamente das decisões de produto e colaborando de forma próxima com desenvolvedores e stakeholders para construir soluções baseadas em <strong>pesquisa com usuários, testes de usabilidade e análise de mercado</strong>.\n\nTenho foco em <strong>arquitetura da informação, definição de requisitos, desenho de fluxos complexos e prototipação de alta fidelidade</strong>. Já trabalhei em produtos como aplicativos mobile de rastreamento veicular e plataformas de agendamento, sempre buscando <strong>simplificar fluxos, aumentar clareza e garantir escalabilidade</strong>.\n\nMe motiva resolver <strong>problemas reais de produto</strong>, tomar decisões bem fundamentadas e construir soluções <strong>claras, usáveis e sustentáveis ao longo do tempo</strong>.',
          education: {
            title: 'Formação profissional',
            item1:
              'Pós-graduação <strong>User Experience and Beyond</strong>. PUCRS — <em>Cursando</em>',
            item2:
              '<strong>Google UX Design Professional Certificate</strong>. Google — Coursera',
            item3: '<strong>Bacharel em Direito</strong>. Faculdade Pitágoras',
          },
          courses: {
            title: 'Cursos complementares',
            item1:
              'Curso “Create High-Fidelity Designs and Prototypes in Figma”. Google — Coursera',
            item2:
              'Curso “Conduct UX Research and Test Early Concepts”. Google — Coursera',
            item3: '<strong>User Experience</strong>. FIAP',
          },
          tools: {
            title: 'Ferramentas',
            research: 'Pesquisa & validação',
            collaboration: 'Colaboração & ideação',
            management: 'Gestão & documentação',
            design: 'Design & prototipação',
          },
          competencies: {
            title: 'Competências',
            productOrUx: 'Competências em Product & UX',
            process: 'Competências de processo',
            items: {
              research: 'Pesquisa e descoberta',
              definition: 'Definição de problemas e requisitos',
              ia: 'Arquitetura da informação e fluxos',
              prototyping: 'Prototipação e validação',
              collaboration: 'Colaboração e comunicação',
              data: 'Decisão baseada em dados',
              empathy: 'Escuta ativa e empatia',
              planning: 'Planejamento e documentação',
              delivery: 'Entrega em contextos complexos',
            },
          },
          beyondWork: {
            title: 'Além do trabalho',
            text: 'Atuo como <strong>regente de coral</strong>, experiência que reforça minha habilidade em <strong>liderar grupos, organizar processos, ouvir diferentes vozes e conduzir pessoas em direção a um objetivo comum</strong>.\n\nFora isso, gosto de tocar piano, passar tempo com a família jogando board games e aproveitar momentos mais tranquilos lendo um bom livro ou assistindo a alguma série com meu marido.',
          },
        },
        nav: {
          home: 'Início',
          about: 'Sobre',
          skills: 'Habilidades',
          experience: 'Experiência',
          projects: 'Projetos',
          contact: 'Contato',
        },
        howIWork: {
          title: 'Como eu trabalho',
          step1:
            'Começo entendendo o <strong>problema e o contexto</strong>, antes de pensar em soluções',
          step2:
            'Uso <strong>pesquisa com usuários e dados</strong> para embasar decisões de produto',
          step3:
            'Traduzo necessidades em <strong>requisitos claros, fluxos e arquitetura da informação</strong>',
          step4:
            'Prototipo e valido soluções de forma <strong>iterativa</strong>, com testes e feedback real',
          step5:
            'Trabalho de forma próxima com <strong>desenvolvedores e stakeholders</strong>, facilitando alinhamentos',
          step6:
            'Registro decisões e aprendizados para garantir <strong>clareza, consistência e escala</strong>',
        },
        projects: {
          comingSoon: 'Em breve',
          laneToggle: {
            label: 'Visualização',
            fast: 'Rápida',
            slow: 'Detalhada',
            ariaLabel: 'Escolher visualização: atualmente {{current}}',
            liveRegion: 'Visualização alterada para {{lane}}',
          },
          metadata: {
            role: 'Papel',
            platform: 'Plataforma',
            designTools: 'Ferramentas de design',
          },
        },
      },
    },
  },
  lng: 'pt', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

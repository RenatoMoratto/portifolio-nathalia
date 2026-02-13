import coverRegistroClasses from '../assets/images/registro-classes.png';
// Using the same image as in the original file, likely a placeholder or copy-paste error in original
import coverAppRastreioVeicular from '../assets/images/registro-classes.png';

export const en = {
  translation: {
    title: 'Nathália Moratto Caldeira',
    role: 'Product Designer | UX researcher, UX designer, QA',
    manifest: 'DESIGN AS A DECISION TOOL\nfor clear, usable and sustainable products',
    navbar: {
      aria: {
        toggleMenu: 'Toggle menu',
      },
    },
    hero: {
      rolePrefix: 'Product Designer',
      roles: [
        'UX Designer',
        'UX Researcher',
        'Quality Assurance',
        'Information Architect',
      ],
    },
    about: {
      title: 'About Me',
      imageAlt: 'Nathália Moratto Caldeira',
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
        item2: 'Course “Conduct UX Research and Test Early Concepts”. Google — Coursera',
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
      steps: [
        {
          title: 'Understand',
          description:
            'I start by understanding the <strong>problem and context</strong>, before thinking about solutions',
          tools: ['User Interviews', 'Stakeholder Workshops', 'Data Analysis'],
          process: ['Define Goals', 'Map Constraints', 'Identify KPIs'],
        },
        {
          title: 'Research',
          description:
            'I use <strong>user research and data</strong> to base product decisions',
          tools: ['Benchmark', 'Desk Research', 'Surveys'],
          process: ['Competitor Analysis', 'User Personas', 'Journey Mapping'],
        },
        {
          title: 'Define',
          description:
            'I translate needs into <strong>clear requirements, flows and information architecture</strong>',
          tools: ['Miro', 'FigJam', 'Flowcharts'],
          process: ['User Flows', 'Sitemaps', 'Requirement Doc'],
        },
        {
          title: 'Prototype',
          description:
            'I prototype and validate solutions <strong>iteratively</strong>, with tests and real feedback',
          tools: ['Figma', 'Protopie', 'Usability Hub'],
          process: ['Wireframing', 'Interactive Prototypes', 'Usability Testing'],
        },
        {
          title: 'Collaborate',
          description:
            'I work closely with <strong>developers and stakeholders</strong>, facilitating alignment',
          tools: ['Jira', 'Notion', 'Slack'],
          process: ['Design Handoff', 'QA Support', 'Design Review'],
        },
        {
          title: 'Document',
          description:
            'I register decisions and learnings to ensure <strong>clarity, consistency and scale</strong>',
          tools: ['Design System', 'Documentation', 'Loom'],
          process: ['Style Guides', 'Pattern Library', 'Post-mortem'],
        },
      ],
    },
    projects: {
      comingSoon: 'Coming soon',
      laneToggle: {
        label: 'View',
        fast: 'Fast',
        slow: 'Slow',
        ariaLabel: 'Choose lane: currently {{current}}',
        liveRegion: 'Lane changed to {{lane}}',
        fastLabel: 'Fast',
        slowLabel: 'Slow',
      },
      metadata: {
        role: 'Role',
        platform: 'Platform',
        designTools: 'Design tools',
      },
      items: [
        {
          slug: 'registro-de-classes',
          title: 'Class Registry',
          role: 'Product Designer, QA',
          platform: 'iOS and Android',
          designTools: 'Figma, Balsamiq',
          shortDescription:
            'Hybrid system (physical + digital) to organize activities, attendance, and evidence of progressive classes in the Pathfinder Club Pioneers of Paraná.',
          coverImage: coverRegistroClasses,
          fastLane: [
            {
              heading: 'CONTEXT',
              content: [
                'Project developed in 2023 with the Pathfinder Club Pioneers of Paraná, an educational organization working with children and adolescents aged 10-15 through progressive classes.',
                'Throughout the year, instructors need to apply activities, track student progress, and finally prove everything to the regional body so that Pathfinders can be invested.',
                'To do this, they need to maintain: Attendance, Completed activities, Evidence (mainly photos), Organization by Pathfinder and by date.',
              ],
            },
            {
              heading: 'PROBLEM',
              content: [
                'Instructors had difficulty maintaining control and traceability of what was done during the year, creating difficulties at accountability time.',
                'Each used their own system (paper, phone photos, Google Drive, site, app, and booklet), resulting in: Lack of a single reliable record, Scattered and divergent information, Loss of evidence, Much rework at the end of the year.',
                'This scenario affected both experienced and novice instructors, causing insecurity, waste of time, and risk of failures in official validation.',
              ],
            },
            {
              heading: 'MY ROLE',
              content: ['Product Designer, UX/UI Designer, UX Researcher'],
            },
            {
              heading: 'DISCOVERY',
              content: [
                'Since there was no structured data on the current process, I conducted qualitative interviews with 5 instructors who served the previous year and 1 class coordinator.',
                'Objectives were: Understand how they organized their classes, Identify pains and improvisations, Map how they did the proof at the end of the year.',
                'During conversations, it became clear that each instructor had created their own "system", but none were truly reliable or scalable.',
              ],
            },
            {
              heading: 'PERSONAS',
              content: [
                'Based on identified behavior patterns, I built two personas representing relevant extremes of the problem: Marcos — experienced instructor, organized, but overwhelmed by information volume; Cinthia — novice instructor, insecure about rules and dependent on official sources.',
              ],
            },
            {
              heading: 'JOURNEY',
              content: [
                'Based on interviews, I mapped the entire journey in Miro, analyzing: What each persona did, thought, where they felt frustration, and where opportunities for improvement existed.',
                'This clearly highlighted where organization broke down — especially post-class and at year-end.',
              ],
            },
            {
              heading: 'INSIGHTS',
              content: [
                'Research synthesis showed that: No single reliable source existed, Organization was manual and fragile, Evidence was scattered, The greatest stress happened at year closing.',
                'Additionally: Novice instructors sought security, Experienced instructors sought agility and control.',
              ],
            },
            {
              heading: 'IDEATION',
              content: [
                'With insights in hand, I presented findings to the club board and project developer.',
                'Considering: Zero budget, Single developer, Unstable internet, Preference for paper.',
                'We opted for a hybrid MVP, creating: A physical product for field use, A digital system for registration and traceability.',
              ],
            },
            {
              heading: 'SOLUTION',
              content: [
                'The physical guide was created to organize day-to-day class work. Bringing a quick view of student progress and eliminating divergences between sources.',
                'The digital system to ensure nothing was lost throughout the year.',
              ],
            },
            {
              heading: 'PROTOTYPING AND TESTING',
              content: [
                'The digital system was prototyped in Figma and tested with 3 instructors, who managed to: Register activities, Attach evidence, Navigate between dates and Pathfinders.',
                'This validated the flow before implementation.',
              ],
            },
            {
              heading: 'RESULTS',
              content: [
                'The physical guide is already in use and brought: Better organization, Less rework, More confidence in meeting requirements.',
                "Digital system tests confirmed the proposed flow works in the instructors' real context.",
              ],
            },
            {
              heading: 'LEARNINGS',
              content: [
                'This project reinforced that: Context matters more than technology, Well-defined MVP generates real impact, Hybrid solutions can be more effective, Working close to development prevents rework.',
              ],
            },
          ],
          slowLane: [
            {
              heading: 'CONTEXT',
              content: [
                'The project was developed in 2023 with the Pathfinder Club Pioneers of Paraná, an educational organization working with children and adolescents aged 10-15 through structured activities called progressive classes.',
                "Each class has an official list of requirements defined by the association. Throughout the year, instructors need to apply these activities, track each child's progress, and at year-end prove everything to the regional body so students can be officially invested.",
                'In practice, this means instructors need to maintain: Attendance record, Activity record, Evidence (mainly photos), Organization by Pathfinder and by date.',
              ],
            },
            {
              heading: 'PROBLEM',
              content: [
                'It was identified that instructors had great difficulty maintaining control and traceability of activities throughout the year, generating significant difficulties at accountability time.',
                'Each instructor had created their own form of organization, combining: Paper notes, Phone photos, Google Drive folders, Info from site, app, and official booklet.',
                'Main pains were: Lack of a single system to record activities, attendance and evidence, Dependence on paper notes, loose photos and disorganized cloud services, Divergence between site, app and booklet info, Intense rework at year-end to gather everything done.',
                'This scenario affected both experienced and novice instructors, generating insecurity, time loss and risk of failing to correctly prove class completion.',
              ],
            },
            {
              heading: 'MY ROLE',
              content: [
                'I acted as the sole Product Designer on the team, responsible for: Planning and creating research, Synthesizing insights, Defining solution strategy, Creating physical and digital artifacts, Prototyping, testing and iterating.',
                'The team also counted on a volunteer front-end developer.',
              ],
            },
            {
              heading: 'DISCOVERY',
              content: [
                'At the start, I mapped key profiles involved in the process: Primary users — Class instructors, Regionals (final validation), Stakeholders — Club Board, Class Coordinators, Pathfinders.',
                'This mapping was essential to understand the product needed to serve not just who executes activities, but also who audits and validates the process at the end.',
              ],
            },
            {
              heading: 'IN-DEPTH INTERVIEWS',
              content: [
                'Since no structured data existed on the current process, I conducted qualitative interviews to understand how instructors really worked.',
                'Research objectives: Understand how instructors organized their classes the previous year, Identify pains, improvisations and risks, Map how documentation and proof were done.',
                'Recruitment profile: 5 instructors responsible for previous year classes (3 experienced, 2 novices), 1 class coordinator.',
                'Topics covered: How they chose official requirement source, How they recorded attendance/activities/progress, How they dealt with photos/evidence, How final delivery to regional worked, Digital tool familiarity.',
                'These interviews revealed a clear pattern: Each instructor had created their own improvised system, none truly reliable and scalable.',
              ],
            },
            {
              heading: 'PERSONAS',
              content: [
                'Based on identified behavior patterns, I built two personas representing relevant extremes of the problem: Marcos — experienced instructor, organized, but overwhelmed by information volume; Cinthia — novice instructor, insecure about rules and dependent on official sources.',
                'These personas were used as continuous reference during the design process to validate decisions and prioritization.',
              ],
            },
            {
              heading: 'USER JOURNEY',
              content: [
                'Based on interviews, I mapped the complete journey of each persona, from class planning to documentation delivery.',
                'Used Miro to structure: Actions, Thoughts, Emotions, Friction points, Improvement opportunities.',
                'Marcos (blue) and Cinthia (pink) journeys allowed clear visualization of where: Effort was highest, Errors happened, Insecurity arose.',
                'From this map, opportunities became evident to: Reduce rework, Increase predictability, Improve information traceability.',
              ],
            },
            {
              heading: 'INSIGHTS',
              content: [
                "Research synthesis revealed critical patterns: Instructors didn't trust a single official source, Most organization was manual/fragmented, Photos scattered, Peak stress at year-end.",
                'Additionally, it was clear that: Novice instructors sought security/guidance, Experienced instructors sought speed/control.',
                'These two profiles had different needs but shared the same risk: failing to correctly prove what was done.',
              ],
            },
            {
              heading: 'IDEATION',
              content: [
                'With insights in hand, I presented findings to club board and developer.',
                'Ideation considered three fundamental constraints: Zero budget, Limited technical team (1 volunteer dev), Unstable internet context and paper preference.',
                'From this, we decided to work with a hybrid MVP: Low-cost physical artifact with high adoption, Simple digital system focused on recording/traceability.',
                'This approach would: Generate immediate value, Reduce adoption risk, Evolve digital product incrementally.',
              ],
            },
            {
              heading: 'SOLUTION',
              content: [
                'PHYSICAL PRODUCT — CLASS GUIDE: Designed to be the primary organization source during classes. Key features: Record of two pathfinders per sheet, Clear view of completed/pending requirements, Official colors, A4 print compatible.',
                'This artifact: Gives security to novice instructors, Gives quick progress view to experienced ones, Works without internet.',
                'DIGITAL PRODUCT — REGISTRY SYSTEM: Digital product thought as post-class complement. Focus: Centralize photos/dates/activities, Automatically organize info, Generate reliable base for accountability.',
                'Flow designed to work mainly on mobile, considering field use.',
              ],
            },
            {
              heading: 'WIREFRAMES',
              content: [
                'Before high fidelity, aligned technical possibilities with developer. I: Listed features, Prioritized only MVP viable ones, Drew manual wireframes to accelerate iteration.',
                'This step avoided time waste on unimplementable solutions.',
              ],
            },
            {
              heading: 'PROTOTYPING AND TESTING',
              content: [
                'Navigable prototype developed in Figma, following: Official class colors, Logic validated in wireframes.',
                'Conducted usability tests with 3 instructors who validated: Clarity of registry flow, Ease of attaching evidence, Understanding of class progression.',
                'Tests resulted in navigation and hierarchy adjustments before development start.',
              ],
            },
            {
              heading: 'RESULTS',
              content: [
                'Although digital system is still in dev, physical product (class guide) was implemented and used.',
                'Impacts identified: Significant reduction in organization complaints, Greater visual clarity on progress, Less rework in activity choice, Greater instructor security.',
                'Digital system usability tests validated: Ease of recording/attaching, Clarity of view, Suitability of flow to real context.',
                'Tests allowed adjustments before implementation, reducing technical rework risk.',
              ],
            },
            {
              heading: 'LEARNINGS',
              content: [
                'This project consolidated principles guiding my Product Designer work: Design must adapt to context, Well-defined MVP generates impact faster, Hybrid solutions can be effective, Involving dev from start reduces waste.',
                'Reinforced my capacity to connect research, product decision and design execution to solve real problems.',
              ],
            },
          ],
        },
        {
          slug: 'app-rastreio-veicular',
          title: 'Vehicle Tracking App',
          role: 'Product Designer, UX Researcher, QA',
          platform: 'iOS and Android',
          designTools: 'Figma, Balsamiq',
          shortDescription:
            'Complete restructuring of information architecture and mobile experience of a fleet tracking and management system during migration to Flutter.',
          coverImage: coverAppRastreioVeicular,
          fastLane: [
            {
              heading: 'CONTEXT',
              content: [
                'Project developed for a mobile fleet tracking and management system used by companies to monitor vehicles, send commands, and follow operations in real-time.',
                "The company's main product was robust desktop software, while mobile apps worked as an operational extension.",
                'Over time, apps grew reactively, accumulating features without clear architecture vision.',
              ],
            },
            {
              heading: 'PROBLEM',
              content: [
                'Android and iOS evolved differently, accumulating conflicting rules, inconsistent navigation, and multiple paths for same actions.',
                "Migration to Flutter made it clear it wasn't possible to just recreate screens without reorganizing the system.",
                "Any UX error would directly impact clients' real operations.",
              ],
            },
            {
              heading: 'MY ROLE',
              content: [
                'Acted as sole Product Designer, responsible for research, information architecture, flows, prototyping, and validation.',
                'Worked in partnership with a Product Manager and two developers, presenting decisions directly to client.',
              ],
            },
            {
              heading: 'RESEARCH',
              content: [
                'Combined desk research with App Store/Play Store reviews and in-depth interviews with users from different sized companies.',
                "Data showed problem wasn't lack of features, but excess of poorly organized complexity.",
              ],
            },
            {
              heading: 'ARCHITECTURE',
              content: [
                'Created complete Android and iOS sitemaps to make complexity visible.',
                'From there, developed a new unified sitemap, organized by user objectives.',
              ],
            },
            {
              heading: 'SOLUTION',
              content: [
                'Reduction of navigation depth, elimination of redundancies, and creation of reusable patterns.',
                'New UX base prepared for continuous growth.',
              ],
            },
            {
              heading: 'RESULTS',
              content: [
                'Approximately 32% reduction in total screen count.',
                'Reduction of average navigation depth from 5 to 3 levels.',
                'Unification of flows between Android and iOS.',
              ],
            },
          ],
          slowLane: [
            {
              heading: 'PRODUCT CONTEXT',
              content: [
                'Project developed for a mobile fleet tracking/management system.',
                'Main product was stable desktop software; mobile apps were operational extensions.',
                'Apps grew reactively over years without clear architecture.',
              ],
            },
            {
              heading: 'PRODUCT PROBLEM',
              content: [
                'Android and iOS had different navigation structures/rules.',
                'Mobile concentrated its own fragmented logic.',
                'Flutter migration evidenced need for system reorganization.',
              ],
            },
            {
              heading: 'MY ROLE IN TEAM',
              content: [
                'Sole Product Designer responsible for UX strategy: research, IA, flows, prototyping, validation.',
                'Worked with PM and 2 devs.',
              ],
            },
            {
              heading: 'UNDERSTANDING LEGACY',
              content: [
                'Created two complete sitemaps (Android/iOS).',
                'Analysing side-by-side showed two different architectures for same product.',
                'Maps revealed duplicated flows, redundant screens, conflicting rules.',
              ],
            },
            {
              heading: 'USER RESEARCH',
              content: [
                'Combined desk research, store reviews, user interviews.',
                'Feedbacks grouped into themes: maps, commands, reports, driver journey, permissions, performance.',
              ],
            },
            {
              heading: 'SYNTHESIS AND PRIORITIZATION',
              content: [
                'Problems organized by frequency, impact, risk.',
                'MVP focused on critical flows: locate, command, report, map.',
                'Peripheral features mapped but out of initial scope.',
              ],
            },
            {
              heading: 'NEW INFORMATION ARCHITECTURE',
              content: [
                'Designed new unified sitemap structured by user objectives.',
                'Reduced depth, eliminated redundancies.',
                'Validated with client.',
              ],
            },
            {
              heading: 'PROTOTYPING',
              content: [
                'Low fidelity wireframes in Balsamiq first.',
                'Allowed validating rules/navigation without visual distraction.',
                'High fidelity in Figma after approval.',
              ],
            },
            {
              heading: 'INTERFACE DESIGN',
              content: [
                'Without formal design system, analyzed desktop software/brand identity.',
                'Created consistent visual base respecting legacy but organizing interface clearly.',
                'Focus on reducing cognitive noise.',
              ],
            },
            {
              heading: 'RESULTS',
              content: [
                '~32% screen reduction.',
                'Depth reduced 5->3.',
                'Duplicated flows eliminated.',
                'UX base ready for growth.',
              ],
            },
            {
              heading: 'LEARNINGS',
              content: [
                'IA is a product decision.',
                'Isolated user requests need systemic solutions.',
                'Scalability starts in design.',
              ],
            },
          ],
        },
      ],
    },
    contact: {
      title: 'Get In Touch',
      subtitle: "Have a project in mind? Let's work together",
      success: {
        title: 'Message Sent!',
        message: "Thank you for reaching out. I'll get back to you soon!",
      },
      form: {
        name: { label: 'Name', placeholder: 'Your name', error: 'Name is required' },
        email: {
          label: 'Email',
          placeholder: 'your@email.com',
          error: { required: 'Email is required', invalid: 'Please enter a valid email' },
        },
        message: {
          label: 'Message',
          placeholder: 'Tell me about your project...',
          error: {
            required: 'Message is required',
            min: 'Message must be at least 10 characters',
          },
        },
        submit: 'Send Message',
        failed: 'Failed to send message. Please try again later.',
      },
      social: 'Or connect with me on',
    },
    footer: {
      rights: 'All rights reserved.',
    },
    experience: {
      present: 'Present',
      showDetails: 'Show details',
      showLess: 'Show less',
      items: [
        {
          id: 1,
          company: 'Kiwano Tecnologia',
          role: 'Product Designer',
          startDate: '2023-12',
          endDate: undefined,
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
        {
          id: 2,
          company: 'Kiwano Tecnologia',
          role: 'Product Designer — Project: New Maps',
          startDate: '2024-01',
          endDate: '2024-12',
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
        {
          id: 3,
          company: 'DBV Pioneiros do Paraná',
          role: 'UX Designer & UX Researcher',
          startDate: '2022-04',
          endDate: '2022-06',
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
      ],
    },
    projectNav: {
      aria: {
        sections: 'Project sections',
        nav: 'Section navigation',
      },
    },
  },
};

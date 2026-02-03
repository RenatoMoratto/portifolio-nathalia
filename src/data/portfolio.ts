export const personalInfo = {
  name: 'Nathália Moratto Caldeira',
  role: 'Product Designer @Kiwano Tecnologia | UX researcher, UX designer, QA',
  location: 'Brazil',
  experience: '2+ years',
  tagline:
    'DESIGN COMO FERRAMENTA DE DECISÃO para produtos claros, usáveis e sustentáveis',
  email: 'nathaliascaldeira@gmail.com',
  linkedin: 'https://www.linkedin.com/in/nathaliascaldeira/',
};

export interface Experience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights: string[];
}

export const experiences: Experience[] = [
  {
    id: 1,
    company: 'Kiwano Tecnologia',
    role: 'Product Designer',
    startDate: '2023-12',
    endDate: undefined, // Present
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
];

export const projects = [
  {
    id: 1,
    title: 'Project Placeholder 1',
    description: 'Description of the project will go here.',
    tech: ['UX Research', 'Figma'],
    role: 'Product Designer',
    impact: 'Impact of the project',
    github: '#',
    live: '#',
    image: '', // Needs a placeholder image or empty
  },
  {
    id: 2,
    title: 'Project Placeholder 2',
    description: 'Description of the project will go here.',
    tech: ['UI Design', 'Prototyping'],
    role: 'Product Designer',
    impact: 'Impact of the project',
    github: '#',
    live: '#',
    image: '',
  },
  // Add more placeholders if needed
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

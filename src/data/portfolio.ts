export const personalInfo = {
  name: 'Nathália Moratto Caldeira',
  role: 'Product Designer @Kiwano Tecnologia | UX researcher, UX designer, QA',
  location: 'Brazil',
  experience: '2+ years',
  tagline:
    'DESIGN COMO FERRAMENTA DE DECISÃO para produtos claros, usáveis e sustentáveis',
  email: 'nathaliascaldeira@example.com', // Placeholder or need to ask user? Prompt didn't provide email. I'll leave placeholder or empty.
  // Actually prompt didn't provide email. But Contact form needs one to send TO?
  // No, the contact form sends TO the owner (via EmailJS service config).
  // The email in personalInfo is usually for "mailto" links.
  // I will put a placeholder or remove it if not provided. Prompt says "Display a link to LinkedIn", doesn't mention email link display.
  // But Contact page usually has email. I'll put a placeholder.
  github: '#', // Not provided
  linkedin: 'https://www.linkedin.com/in/nathaliascaldeira/',
};

export const skills = {
  // Placeholder structure, will be filled in About page
  product: {
    title: 'Product & UX',
    icon: '🎨',
    items: [
      'Pesquisa e descoberta',
      'Definição de problemas e requisitos',
      'Arquitetura da informação e fluxos',
      'Prototipação e validação',
      'Colaboração e comunicação',
    ],
  },
  process: {
    title: 'Processo',
    icon: '⚙️',
    items: [
      'Decisão baseada em dados',
      'Escuta ativa e empatia',
      'Planejamento e documentação',
      'Entrega em contextos complexos',
    ],
  },
};

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
}

export const experiences: Experience[] = [
  // Will be filled in About page content
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

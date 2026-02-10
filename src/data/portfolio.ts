export const personalInfo = {
  name: 'Nathália Moratto Caldeira',
  role: 'Product Designer @Kiwano Tecnologia | UX researcher, UX designer, QA',
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

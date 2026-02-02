import { SectionHeading, Card } from '../components';
import { skills } from '../data/portfolio';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

function SkillCategory({
  title,
  icon,
  items,
  delay,
}: {
  title: string;
  icon: string;
  items: string[];
  delay: number;
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Card className="h-full group hover:border-primary-500/50 dark:hover:border-primary-500/50">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
            {title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((skill) => (
            <span key={skill} className="skill-badge">
              {skill}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function Skills() {
  const skillCategories = Object.values(skills);

  return (
    <section id="skills" className="section-padding bg-slate-50 dark:bg-slate-900/50">
      <div className="section-container">
        <SectionHeading
          title="Skills & Technologies"
          subtitle="The tools and technologies I use to bring ideas to life"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={category.title}
              title={category.title}
              icon={category.icon}
              items={category.items}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

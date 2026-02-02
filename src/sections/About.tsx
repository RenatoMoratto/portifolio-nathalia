import { SectionHeading, Card } from '../components';
import { personalInfo } from '../data/portfolio';
import { useScrollAnimation } from '../hooks';

export function About() {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="about" className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <div
          ref={ref}
          className={`max-w-4xl mx-auto transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Card variant="glass" className="relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar placeholder */}
                <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {personalInfo.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                <div className="flex-1">
                  <h3 className="heading-3 text-slate-900 dark:text-white mb-4">
                    Senior Frontend & Mobile Engineer
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    I'm a passionate software engineer with{' '}
                    <strong className="text-primary-500">
                      {personalInfo.experience} of experience
                    </strong>{' '}
                    building high-performance, scalable user interfaces. As a{' '}
                    <strong className="text-primary-500">Tech Lead</strong>, I've guided
                    teams to deliver impactful products while maintaining code quality and
                    best practices.
                  </p>

                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                    My expertise spans{' '}
                    <strong className="text-primary-500">
                      React, TypeScript, and Flutter
                    </strong>
                    , allowing me to build exceptional experiences across web and mobile
                    platforms. I thrive in
                    <strong className="text-primary-500">
                      {' '}
                      international remote teams
                    </strong>
                    , bringing a collaborative approach and clear communication to every
                    project.
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-500">4+</div>
                      <div className="text-sm text-slate-500">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-500">20+</div>
                      <div className="text-sm text-slate-500">Projects Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-500">5+</div>
                      <div className="text-sm text-slate-500">Team Members Led</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-500">3</div>
                      <div className="text-sm text-slate-500">Countries Worked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

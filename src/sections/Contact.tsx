import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { SectionHeading, Button, Card, SocialIcons } from '../components';
import { personalInfo } from '../data/portfolio';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('FAILED...', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a project in mind? Let's work together"
        />

        <div
          ref={ref}
          className={cn(
            'max-w-4xl mx-auto',
            'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Contact Info */}
            <div
              className={cn(
                'lg:col-span-2',
                'transition-all duration-700 delay-100',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
            >
              <Card variant="glass" className="h-full">
                <h3 className="heading-3 text-slate-900 dark:text-white mb-5">
                  Let's Connect
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your vision.
                </p>

                <div className="space-y-4 mb-8">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors duration-300">
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{personalInfo.email}</span>
                  </a>

                  <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm">{personalInfo.location}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                    Find me on social media
                  </p>
                  <SocialIcons />
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div
              className={cn(
                'lg:col-span-3',
                'transition-all duration-700 delay-200',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
            >
              <Card>
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="heading-3 text-slate-900 dark:text-white mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Thank you for reaching out. I'll get back to you soon!
                    </p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={cn(
                          'input-field',
                          errors.name &&
                            'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20',
                        )}
                        placeholder="Your name"
                      />
                      {errors.name && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={cn(
                          'input-field',
                          errors.email &&
                            'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20',
                        )}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className={cn(
                          'input-field resize-none',
                          errors.message &&
                            'border-red-400 dark:border-red-500 focus:border-red-400 focus:ring-red-400/20',
                        )}
                        placeholder="Tell me about your project..."
                      />
                      {errors.message && (
                        <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full mt-2"
                      isLoading={isSubmitting}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      Send Message
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

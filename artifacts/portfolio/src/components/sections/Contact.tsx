import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSubmitContact } from '@workspace/api-client-react';
import { toast } from 'react-hot-toast';
import { Mail, MapPin, Clock } from 'lucide-react';
import { useGetProfile } from '@workspace/api-client-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  projectType: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export function Contact() {
  const { data: profile } = useGetProfile();
  const [isSuccess, setIsSuccess] = useState(false);
  const submitContact = useSubmitContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
          toast.success('Message sent successfully!');
          reset();
          setTimeout(() => setIsSuccess(false), 3000);
        },
        onError: () => {
          toast.error('Failed to send message. Please try again.');
        },
      }
    );
  };

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8" data-testid="section-title-contact">
          Let&apos;s Work <span className="gradient-text">Together</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Have a project in mind? Let&apos;s discuss how I can help bring your ideas to life.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <p className="text-muted-foreground">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
            </div>

            <div className="space-y-4">
              {profile?.email && (
                <div className="flex items-start gap-4 glass rounded-xl p-4" data-testid="contact-email">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center glow-primary" style={{ background: 'var(--gradient-primary)' }}>
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
              )}

              {profile?.location && (
                <div className="flex items-start gap-4 glass rounded-xl p-4" data-testid="contact-location">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center glow-secondary" style={{ background: 'linear-gradient(135deg, #06B6D4, #06B6D488)' }}>
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Location</h4>
                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 glass rounded-xl p-4" data-testid="contact-availability">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center glow-accent" style={{ background: 'linear-gradient(135deg, #F472B6, #F472B688)' }}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Availability</h4>
                  <p className="text-sm text-muted-foreground">
                    {profile?.availableForWork ? 'Available for new projects' : 'Currently unavailable'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="glass-strong rounded-2xl p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-green-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-center">
                  Thank you for reaching out. I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <input
                    {...register('name')}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all"
                    data-testid="input-name"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all"
                    data-testid="input-email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register('subject')}
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all"
                    data-testid="input-subject"
                  />
                  {errors.subject && (
                    <p className="text-destructive text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    {...register('projectType')}
                    className="px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all"
                    data-testid="select-project-type"
                  >
                    <option value="">Project Type</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>

                  <select
                    {...register('budget')}
                    className="px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all"
                    data-testid="select-budget"
                  >
                    <option value="">Budget Range</option>
                    <option value="<5k">Less than $5k</option>
                    <option value="5k-10k">$5k - $10k</option>
                    <option value="10k-25k">$10k - $25k</option>
                    <option value="25k+">$25k+</option>
                  </select>
                </div>

                <div>
                  <textarea
                    {...register('message')}
                    placeholder="Your Message"
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg glass focus:glass-strong outline-none transition-all resize-none"
                    data-testid="textarea-message"
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitContact.isPending}
                  className="w-full px-6 py-4 rounded-full font-semibold transition-all hover:scale-105 glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--gradient-primary)' }}
                  data-testid="button-submit-contact"
                >
                  {submitContact.isPending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

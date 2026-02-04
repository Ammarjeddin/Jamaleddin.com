"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

interface ContactInfoProps {
  heading?: string;
  showForm?: boolean;
  showMap?: boolean;
  mapEmbedUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  isFirstBlock?: boolean;
}

export function ContactInfo({
  heading,
  showForm = true,
  showMap = false,
  mapEmbedUrl,
  email,
  phone,
  address,
  isFirstBlock = false,
}: ContactInfoProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section
      className={cn(
        "section",
        isFirstBlock && "-mt-20 pt-36 sm:pt-40"
      )}
    >
      <Container>
        {heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-[var(--color-text)] px-4 sm:px-0">
            {heading}
          </h2>
        )}

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
          {/* Contact Form */}
          {showForm && (
            <div className="contact-card p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-zinc-100">
                Send us a message
              </h3>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-500/20 border border-green-500/30">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2 text-zinc-100">
                    Message Sent!
                  </h4>
                  <p className="text-zinc-400">
                    We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="glass-input w-full px-4 py-3.5 sm:py-3 rounded-xl sm:rounded-lg focus:outline-none text-base"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-zinc-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="glass-input w-full px-4 py-3.5 sm:py-3 rounded-xl sm:rounded-lg focus:outline-none text-base"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="glass-input w-full px-4 py-3.5 sm:py-3 rounded-xl sm:rounded-lg focus:outline-none text-base"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-300">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={5}
                      className="glass-input w-full px-4 py-3.5 sm:py-3 rounded-xl sm:rounded-lg focus:outline-none resize-none text-base"
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full py-4 sm:py-3 text-base disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-4 h-4" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Contact Details & Map */}
          <div className="space-y-5 sm:space-y-6">
            {/* Contact Details */}
            <div className="contact-card p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-zinc-100">
                Contact Details
              </h3>
              <div className="space-y-4">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 sm:gap-4 text-zinc-400 hover:text-[var(--color-accent)] active:scale-[0.98] transition-all group min-h-[48px]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 group-hover:border-[var(--color-accent)]/40 transition-colors flex-shrink-0">
                      <Mail className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <span className="text-sm sm:text-base break-all">{email}</span>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 sm:gap-4 text-zinc-400 hover:text-[var(--color-accent)] active:scale-[0.98] transition-all group min-h-[48px]"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 group-hover:border-[var(--color-accent)]/40 transition-colors flex-shrink-0">
                      <Phone className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <span className="text-sm sm:text-base">{phone}</span>
                  </a>
                )}
                {address && (
                  <div className="flex items-start gap-3 sm:gap-4 text-zinc-400">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20">
                      <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <span className="whitespace-pre-line pt-2.5 sm:pt-3 text-sm sm:text-base">{address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {showMap && mapEmbedUrl && (
              <div className="contact-card overflow-hidden">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                  className="opacity-80"
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

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
  const { isDarkMode } = useDarkMode();
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

  // Dark mode styles
  const labelStyle = { color: isDarkMode ? "#ffffff" : "#374151" };
  const inputStyle = {
    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#1f2937",
    borderColor: isDarkMode ? "#475569" : "#d1d5db",
  };
  const cardStyle = {
    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
  };
  const headingStyle = { color: isDarkMode ? "#ffffff" : "#111827" };
  const textStyle = { color: isDarkMode ? "#e2e8f0" : "#4b5563" };
  const sectionStyle = {
    backgroundColor: isDarkMode ? "#0f172a" : undefined,
  };
  const iconContainerStyle = {
    backgroundColor: isDarkMode ? "rgba(var(--color-primary-rgb), 0.2)" : "rgba(var(--color-primary-rgb), 0.1)",
  };
  const buttonStyle = {
    backgroundColor: isDarkMode ? "var(--color-primary)" : undefined,
    color: isDarkMode ? "#ffffff" : undefined,
  };

  return (
    <section 
      className={cn("section", isFirstBlock && "-mt-20 pt-40")}
      style={sectionStyle}
    >
      <Container>
        {heading && (
          <h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={headingStyle}
          >
            {heading}
          </h2>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          {showForm && (
            <div 
              className="card p-8"
              style={cardStyle}
            >
              <h3 
                className="text-2xl font-semibold mb-6"
                style={headingStyle}
              >
                Send us a message
              </h3>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: isDarkMode ? "rgba(34, 197, 94, 0.2)" : "rgb(220, 252, 231)" }}
                  >
                    <Send className="w-8 h-8" style={{ color: isDarkMode ? "#4ade80" : "#16a34a" }} />
                  </div>
                  <h4 
                    className="text-xl font-semibold mb-2"
                    style={headingStyle}
                  >
                    Message Sent!
                  </h4>
                  <p style={textStyle}>
                    We&apos;ll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        style={inputStyle}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2"
                        style={labelStyle}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        style={inputStyle}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={labelStyle}
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      style={inputStyle}
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={labelStyle}
                    >
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={5}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                      style={inputStyle}
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full disabled:opacity-50"
                    style={buttonStyle}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Contact Details & Map */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div 
              className="card p-8"
              style={cardStyle}
            >
              <h3 
                className="text-2xl font-semibold mb-6"
                style={headingStyle}
              >
                Contact Details
              </h3>
              <div className="space-y-4">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-4 hover:text-[var(--color-primary)] transition-colors"
                    style={textStyle}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={iconContainerStyle}
                    >
                      <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <span>{email}</span>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-4 hover:text-[var(--color-primary)] transition-colors"
                    style={textStyle}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={iconContainerStyle}
                    >
                      <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <span>{phone}</span>
                  </a>
                )}
                {address && (
                  <div 
                    className="flex items-start gap-4"
                    style={textStyle}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={iconContainerStyle}
                    >
                      <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <span className="whitespace-pre-line">{address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {showMap && mapEmbedUrl && (
              <div className="card overflow-hidden" style={cardStyle}>
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

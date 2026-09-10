import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Alert,
} from '../../../components/common';

// ─── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts optional country code, spaces, dashes, dots, parens — 7–15 digits
const PHONE_RE = /^[+\d][\d\s\-().]{6,17}$/;

const validate = (fields) => {
  const errors = {};

  const name = fields.fullName.trim();
  if (!name) {
    errors.fullName = 'Full name is required.';
  } else if (name.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  const email = fields.email.trim();
  if (!email) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  const phone = fields.phone.trim();
  if (phone && !PHONE_RE.test(phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  const message = fields.message.trim();
  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
};

// ─── Info card sub-component ───────────────────────────────────────────────────

const InfoCard = ({ icon, heading, children }) => (
  <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-border">
    <div
      aria-hidden="true"
      className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"
    >
      <span className="text-primary">{icon}</span>
    </div>
    <div>
      <p className="text-sm font-semibold text-text mb-0.5">{heading}</p>
      <div className="text-sm text-text-secondary leading-relaxed">{children}</div>
    </div>
  </div>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const INITIAL_FORM = { fullName: '', email: '', phone: '', message: '' };

const ContactPage = () => {
  const [fields, setFields] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear individual error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      // Focus the first field with an error
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`contact-${firstKey}`);
      if (el) el.focus();
      return;
    }

    setFieldErrors({});
    setSubmitStatus('loading');

    /*
     * API INTEGRATION PENDING
     * ────────────────────────────────────────────────────────────────────────
     * The backend `Feedback` model (POST /api/feedback/) requires authentication
     * and a `user` FK — it cannot accept anonymous public contact submissions.
     *
     * A dedicated public contact-submission endpoint is needed on the backend
     * (e.g. POST /api/contact/) before this form can be wired to the API.
     *
     * When that endpoint is available, replace the simulated delay below with:
     *
     *   import axiosInstance from '../../../api/axiosInstance';
     *   await axiosInstance.post('/contact/', {
     *     full_name: fields.fullName.trim(),
     *     email: fields.email.trim(),
     *     phone: fields.phone.trim() || undefined,
     *     message: fields.message.trim(),
     *   });
     *
     * ────────────────────────────────────────────────────────────────────────
     * For now, simulate a brief processing delay so all UI states are testable.
     */
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      // Simulated success — replace with real API call when endpoint is available
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  const handleReset = () => {
    setFields(INITIAL_FORM);
    setFieldErrors({});
    setSubmitStatus(null);
  };

  const isLoading = submitStatus === 'loading';

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="mb-10 border-b border-border pb-8">
          <h1 className="text-3xl font-extrabold text-text tracking-tight sm:text-4xl mb-2">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl leading-relaxed">
            Have a question or need help using JeevanSetu? Send us a message and
            we will get back to you.
          </p>
        </header>

        {/* ── Two-column layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-14">

          {/* ── Left column — informational ──────────────────────────────── */}
          <aside
            aria-label="Contact information"
            className="lg:col-span-2 space-y-4"
          >
            <InfoCard
              heading="General Questions"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Use the form to ask any general questions about JeevanSetu,
              including how to use the platform or how predictions are generated.
            </InfoCard>

            <InfoCard
              heading="JeevanSetu Support"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            >
              If you are experiencing a technical issue, please describe the
              problem clearly in your message and include any relevant details.
            </InfoCard>

            <InfoCard
              heading="Project Information"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              JeevanSetu is a healthcare-focused informational platform. For
              information about the project, use the{' '}
              <a href="/about" className="text-primary hover:underline font-medium">
                About page
              </a>{' '}
              or submit a message here.
            </InfoCard>

            {/* Medical disclaimer */}
            <div className="mt-2">
              <Alert
                variant="warning"
                message="JeevanSetu does not provide medical diagnosis, emergency healthcare support, or treatment advice. For medical emergencies, contact your local emergency services immediately."
              />
            </div>
          </aside>

          {/* ── Right column — contact form ───────────────────────────────── */}
          <section
            aria-label="Contact form"
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">

              {/* ── Success state ───────────────────────────────────────── */}
              {submitStatus === 'success' ? (
                <div className="flex flex-col items-center text-center py-8 px-4" role="status" aria-live="polite">
                  <div
                    aria-hidden="true"
                    className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
                  >
                    <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-text mb-2">Message Sent</h2>
                  <p className="text-text-secondary text-sm mb-6 max-w-xs leading-relaxed">
                    Your message has been submitted successfully.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    id="contact-send-another-btn"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-text mb-6">Send a Message</h2>

                  {/* ── Global error banner ─────────────────────────────── */}
                  {submitStatus === 'error' && (
                    <div className="mb-6">
                      <Alert
                        variant="error"
                        title="Unable to Send Message"
                        message="Your message could not be submitted. Please try again."
                        dismissible
                        onClose={() => setSubmitStatus(null)}
                      />
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Contact form"
                    className="space-y-5"
                  >
                    {/* Full Name */}
                    <Input
                      id="contact-fullName"
                      name="fullName"
                      label="Full Name"
                      type="text"
                      value={fields.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      disabled={isLoading}
                      error={fieldErrors.fullName}
                      autoComplete="name"
                    />

                    {/* Email */}
                    <Input
                      id="contact-email"
                      name="email"
                      label="Email Address"
                      type="email"
                      value={fields.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      disabled={isLoading}
                      error={fieldErrors.email}
                      autoComplete="email"
                    />

                    {/* Phone (optional) */}
                    <Input
                      id="contact-phone"
                      name="phone"
                      label="Phone Number"
                      type="tel"
                      value={fields.phone}
                      onChange={handleChange}
                      placeholder="Optional"
                      disabled={isLoading}
                      error={fieldErrors.phone}
                      helperText={!fieldErrors.phone ? 'Optional' : undefined}
                      autoComplete="tel"
                    />

                    {/* Message */}
                    <Textarea
                      id="contact-message"
                      name="message"
                      label="Message"
                      value={fields.message}
                      onChange={handleChange}
                      placeholder="Describe your question or issue..."
                      rows={5}
                      required
                      disabled={isLoading}
                      error={fieldErrors.message}
                    />

                    {/* Submit */}
                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                        id="contact-submit-btn"
                        className="w-full sm:w-auto"
                      >
                        Send Message
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default ContactPage;

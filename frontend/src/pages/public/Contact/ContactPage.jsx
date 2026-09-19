import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Alert,
} from '../../../components/common';
import contactApi from '../../../api/contactApi';

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
  const [apiErrorMessage, setApiErrorMessage] = useState('');

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
    if (submitStatus === 'loading') return;

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
    setApiErrorMessage('');
    setSubmitStatus('loading');

    try {
      await contactApi.submitContactMessage({
        full_name: fields.fullName.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim() || undefined,
        message: fields.message.trim(),
      });

      setSubmitStatus('success');
      setFields(INITIAL_FORM);
    } catch (err) {
      let errorMsg = 'Your message could not be submitted. Please try again.';

      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.detail) {
          errorMsg = data.detail;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (typeof data === 'object') {
          const backendFieldErrors = {};
          if (data.full_name) backendFieldErrors.fullName = Array.isArray(data.full_name) ? data.full_name[0] : data.full_name;
          if (data.email) backendFieldErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
          if (data.phone) backendFieldErrors.phone = Array.isArray(data.phone) ? data.phone[0] : data.phone;
          if (data.message) backendFieldErrors.message = Array.isArray(data.message) ? data.message[0] : data.message;
          if (Object.keys(backendFieldErrors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...backendFieldErrors }));
            errorMsg = 'Please correct the highlighted errors and try again.';
          }
        }
      } else if (err.message === 'Network Error' || !err.response) {
        errorMsg = 'Network error. Please check your internet connection and try again.';
      }

      setApiErrorMessage(errorMsg);
      setSubmitStatus('error');
    }
  };

  const handleReset = () => {
    setFields(INITIAL_FORM);
    setFieldErrors({});
    setSubmitStatus(null);
    setApiErrorMessage('');
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
            {/* Direct Email to Admin */}
            <InfoCard
              heading="Direct Administrator Contact"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              All contact submissions are automatically delivered directly to our administrator's inbox:
              <div className="mt-2 font-semibold">
                <a
                  href="mailto:mohitkumarchaurasiya2005@gmail.com"
                  className="text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                  mohitkumarchaurasiya2005@gmail.com
                </a>
              </div>
              <p className="mt-1 text-xs text-text-muted">
                Typical response time: within 24 to 48 hours.
              </p>
            </InfoCard>

            <InfoCard
              heading="General & Technical Inquiries"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              Questions about disease prediction models, account management, or reporting a technical bug?
              Provide the details in the form and our team will get in touch with you.
            </InfoCard>

            <InfoCard
              heading="Project & Collaboration"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            >
              Interested in collaborating, research partnerships, or learning more about the team behind JeevanSetu?
              Visit our{' '}
              <a href="/about" className="text-primary hover:underline font-medium">
                About page
              </a>{' '}
              or leave a message here.
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
                        message={apiErrorMessage || "Your message could not be submitted. Please try again."}
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

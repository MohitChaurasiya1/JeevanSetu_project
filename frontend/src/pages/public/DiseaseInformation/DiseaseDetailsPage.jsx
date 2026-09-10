import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getDiseaseById } from '../../../api/diseaseApi';
import {
  Button,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
} from '../../../components/common';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Split a text field (e.g. precautions) that may contain comma-separated
 * or newline-separated entries into an array of non-empty trimmed strings.
 * Returns null when the field is absent or contains only whitespace.
 */
const splitTextToList = (text) => {
  if (!text || !text.trim()) return null;
  // Try newline split first; fall back to comma split
  const byNewline = text.split('\n').map((s) => s.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;
  const byComma = text.split(',').map((s) => s.trim()).filter(Boolean);
  return byComma.length > 0 ? byComma : null;
};

// ─── Section components ────────────────────────────────────────────────────────

const SectionHeading = ({ children }) => (
  <h2 className="text-lg font-bold text-text mb-3">{children}</h2>
);

const InfoSection = ({ heading, children }) => (
  <section aria-labelledby={`section-${heading.toLowerCase().replace(/\s+/g, '-')}`} className="mb-8">
    <SectionHeading>{heading}</SectionHeading>
    {children}
  </section>
);

// ─── Main Page ─────────────────────────────────────────────────────────────────

const DiseaseDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [disease, setDisease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  const fetchDisease = async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const data = await getDiseaseById(id);
      setDisease(data);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        setNotFound(true);
      } else {
        console.error('Disease detail fetch error:', err);
        setError('Unable to load this disease information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDisease();
    } else {
      setNotFound(true);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleBackToDiseases = () => {
    navigate(ROUTES.DISEASES);
  };

  // ── Shared Back Button ──────────────────────────────────────────────────────
  const BackButton = () => (
    <Button
      variant="ghost"
      onClick={handleBackToDiseases}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary mb-6 px-0"
      id="back-to-diseases-btn"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Diseases
    </Button>
  );

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="py-20">
            <LoadingState message="Loading disease information..." />
          </div>
        </div>
      </main>
    );
  }

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <div className="py-12">
            <ErrorState
              title="Disease Not Found"
              message="The requested disease information could not be found."
              onRetry={handleBackToDiseases}
              retryLabel="Back to Diseases"
            />
          </div>
        </div>
      </main>
    );
  }

  // ── API Error ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <BackButton />
          <div className="py-12">
            <ErrorState
              title="Unable to Load Disease Information"
              message={error}
              onRetry={fetchDisease}
              retryLabel="Try Again"
            />
          </div>
        </div>
      </main>
    );
  }

  if (!disease) return null;

  // ── Parsed field values ─────────────────────────────────────────────────────
  const precautionsList = splitTextToList(disease.precautions);
  const hasRiskMessage = disease.risk_message && disease.risk_message.trim();
  const hasSpecialist = disease.recommended_specialist && disease.recommended_specialist.trim();

  // ── Full Detail View ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Back navigation */}
        <BackButton />

        {/* Page Header */}
        <header className="border-b border-border pb-6 mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-3xl font-extrabold text-text tracking-tight sm:text-4xl leading-tight">
              {disease.name}
            </h1>
            {hasSpecialist && (
              <Badge variant="info" className="mt-1 text-sm shrink-0">
                {disease.recommended_specialist}
              </Badge>
            )}
          </div>
          {disease.description && (
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {disease.description}
            </p>
          )}
        </header>

        {/* Risk Message — only if field has content */}
        {hasRiskMessage && (
          <InfoSection heading="Risk Information">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900 leading-relaxed">{disease.risk_message}</p>
            </div>
          </InfoSection>
        )}

        {/* Precautions — only if field has content */}
        {precautionsList && (
          <InfoSection heading="Precautions">
            <ul className="space-y-2">
              {precautionsList.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-text-secondary"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </InfoSection>
        )}

        {/* Recommended Specialist — standalone callout if no badge above */}
        {hasSpecialist && (
          <InfoSection heading="Recommended Specialist">
            <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{disease.recommended_specialist}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Consider consulting a specialist for professional guidance.
                </p>
              </div>
            </div>
          </InfoSection>
        )}

        {/* No additional info available notice */}
        {!hasRiskMessage && !precautionsList && !hasSpecialist && (
          <div className="mb-8 p-4 rounded-lg bg-slate-50 border border-border text-center">
            <p className="text-sm text-text-muted">
              No additional information is currently available for this disease.
            </p>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="mb-8">
          <Alert
            variant="warning"
            message="JeevanSetu provides informational disease-risk assessments and health information. It is not a substitute for professional medical diagnosis or treatment."
          />
        </div>

        {/* Bottom Back Button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBackToDiseases}
            id="back-to-diseases-bottom-btn"
            className="inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Diseases
          </Button>
        </div>

      </div>
    </main>
  );
};

export default DiseaseDetailsPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getDiseaseById } from '../../../api/diseaseApi';
import {
  Button,
  Card,
  Badge,
  Alert,
  LoadingState,
  ErrorState,
} from '../../../components/common';

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

const HeartPulseIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const UserIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClipboardIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ShieldIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ExclamationIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChevronRightIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);

const CheckCircleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BeakerIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const InfoIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse a value that might be an array, comma-separated string, or newline-separated string
 * into an array of non-empty trimmed strings.
 */
const toArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === 'object' ? v.title || JSON.stringify(v) : String(v))).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    const byNewline = value.split('\n').map((s) => s.trim()).filter(Boolean);
    if (byNewline.length > 1) return byNewline;
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

/** True when the disease name includes "diabetes" (case-insensitive) */
const isDiabetesDisease = (name) => (name || '').toLowerCase().includes('diabetes');

// ─── Static diabetes-only CTA content (unchanged from original) ───────────────

const DIABETES_DIAGNOSIS_TESTS = [
  { name: 'Fasting Plasma Glucose', description: 'Measures blood sugar after an overnight fast.' },
  { name: 'HbA1c (Glycated Hemoglobin)', description: 'Reflects average blood sugar over the past 2–3 months.' },
  { name: 'Oral Glucose Tolerance Test', description: 'Measures blood sugar before and after consuming a glucose drink.' },
];

// ─── Section wrapper components ───────────────────────────────────────────────

const SectionHeading = ({ icon, children }) => (
  <div className="flex items-center gap-2.5 mb-4">
    {icon && (
      <div
        aria-hidden="true"
        className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0"
      >
        <span className="text-primary">{icon}</span>
      </div>
    )}
    <h2 className="text-lg font-bold text-text">{children}</h2>
  </div>
);

const InfoSection = ({ heading, icon, children, className = '' }) => (
  <section
    aria-labelledby={`section-${heading.toLowerCase().replace(/\s+/g, '-')}`}
    className={`mb-8 ${className}`}
  >
    <SectionHeading icon={icon}>{heading}</SectionHeading>
    {children}
  </section>
);

// ─── List rendering ───────────────────────────────────────────────────────────

const BulletList = ({ items }) => (
  <Card className="card-base">
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary">
          <span
            aria-hidden="true"
            className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"
          />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const CheckList = ({ items }) => (
  <Card className="card-base">
    <ul className="space-y-2.5">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary">
          <CheckCircleIcon className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const NumberedCardList = ({ items }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {items.map((item, idx) => (
      <div key={idx} className="card-base p-4 flex items-start gap-3">
        <div
          aria-hidden="true"
          className="mt-0.5 w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0"
        >
          <span className="text-amber-600 text-xs font-bold">{idx + 1}</span>
        </div>
        <div>
          <p className="text-sm text-text-secondary leading-relaxed">{item}</p>
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

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

  const handleBackToDiseases = () => navigate(ROUTES.DISEASES);

  // ── Shared Back Button ──────────────────────────────────────────────────────
  const BackButton = () => (
    <Button
      variant="ghost"
      onClick={handleBackToDiseases}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary mb-6 px-0"
      id="back-to-diseases-btn"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Diseases
    </Button>
  );

  // ── Loading ──────────────────────────────────────────────────────────────────
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

  // ── Not Found ────────────────────────────────────────────────────────────────
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

  // ── API Error ────────────────────────────────────────────────────────────────
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

  // ── Derived values ───────────────────────────────────────────────────────────
  const isDiabetes = isDiabetesDisease(disease.name);
  const hasSpecialist = disease.recommended_specialist?.trim();

  // Parse list fields
  const symptomsList = toArray(disease.symptoms);
  const causesList = toArray(disease.causes);
  const riskFactorsList = toArray(disease.risk_factors);
  const preventionList = toArray(disease.prevention);
  const treatmentList = toArray(disease.treatment);

  // Determine overview text: prefer detailed_description, fallback to description
  const overviewText = disease.detailed_description?.trim() || disease.description?.trim();

  // ── Full Detail View ─────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* ─── 1. Back navigation ──────────────────────────────────────── */}
        <BackButton />

        {/* ─── 2. Disease Header ───────────────────────────────────────── */}
        <header className="border-b border-border pb-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div
              aria-hidden="true"
              className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"
            >
              <HeartPulseIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight leading-tight">
                {disease.name}
              </h1>
              {hasSpecialist && (
                <Badge variant="info" className="text-xs sm:text-sm shrink-0">
                  {disease.recommended_specialist}
                </Badge>
              )}
            </div>
          </div>
          {/* Short description in header if there's a separate detailed_description */}
          {disease.detailed_description && disease.description && (
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              {disease.description}
            </p>
          )}
        </header>

        {/* ─── 3. Overview ─────────────────────────────────────────────── */}
        {overviewText && (
          <InfoSection
            heading={isDiabetes ? 'What is Diabetes?' : `What is ${disease.name}?`}
            icon={<ClipboardIcon className="w-4 h-4" />}
          >
            <Card className="card-base">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                {overviewText}
              </p>
            </Card>
          </InfoSection>
        )}

        {/* ─── 4. Common Symptoms ──────────────────────────────────────── */}
        {symptomsList.length > 0 && (
          <InfoSection
            heading="Common Symptoms"
            icon={<ExclamationIcon className="w-4 h-4" />}
          >
            <BulletList items={symptomsList} />
            <p className="mt-3 text-xs text-text-muted italic">
              Symptoms can vary between individuals. Some people may have no noticeable symptoms.
            </p>
          </InfoSection>
        )}

        {/* ─── 5. Causes ───────────────────────────────────────────────── */}
        {causesList.length > 0 && (
          <InfoSection
            heading="Causes"
            icon={<BeakerIcon className="w-4 h-4" />}
          >
            <CheckList items={causesList} />
          </InfoSection>
        )}

        {/* ─── 6. Risk Factors ─────────────────────────────────────────── */}
        {riskFactorsList.length > 0 && (
          <InfoSection
            heading="Common Risk Factors"
            icon={<ShieldIcon className="w-4 h-4" />}
          >
            <NumberedCardList items={riskFactorsList} />
          </InfoSection>
        )}

        {/* ─── 7. Prevention ───────────────────────────────────────────── */}
        {preventionList.length > 0 && (
          <InfoSection
            heading="Prevention & Healthy Habits"
            icon={<ShieldIcon className="w-4 h-4" />}
          >
            <CheckList items={preventionList} />
          </InfoSection>
        )}

        {/* ─── 8. Treatment / Management ───────────────────────────────── */}
        {treatmentList.length > 0 && (
          <InfoSection
            heading="Treatment / Management"
            icon={<CheckCircleIcon className="w-4 h-4" />}
          >
            <CheckList items={treatmentList} />
          </InfoSection>
        )}

        {/* ─── 9. When to See a Doctor ─────────────────────────────────── */}
        {disease.when_to_see_doctor?.trim() && (
          <InfoSection heading="When to See a Doctor">
            <Card className="card-base">
              <p className="text-sm text-text-secondary leading-relaxed">
                {disease.when_to_see_doctor}
              </p>
            </Card>
          </InfoSection>
        )}

        {/* ─── 10. Additional Information ──────────────────────────────── */}
        {disease.additional_info?.trim() && (
          <InfoSection
            heading="Additional Information"
            icon={<InfoIcon className="w-4 h-4" />}
          >
            <div className="p-4 bg-slate-50 border border-border rounded-lg">
              <p className="text-sm text-text-secondary leading-relaxed">
                {disease.additional_info}
              </p>
            </div>
          </InfoSection>
        )}

        {/* ─── Legacy: risk_message (if no new fields present) ─────────── */}
        {!symptomsList.length && !causesList.length && disease.risk_message?.trim() && (
          <InfoSection heading="Risk Information">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900 leading-relaxed">{disease.risk_message}</p>
            </div>
          </InfoSection>
        )}

        {/* ─── 11. Recommended Specialist ──────────────────────────────── */}
        {hasSpecialist && (
          <InfoSection heading="Recommended Specialist">
            <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg">
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"
              >
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{disease.recommended_specialist}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Consider consulting a qualified healthcare professional for individualized guidance.
                </p>
              </div>
            </div>
          </InfoSection>
        )}

        {/* ─── 12. Diabetes-specific: How is it Diagnosed? ─────────────── */}
        {isDiabetes && (
          <InfoSection
            heading="How is Diabetes Diagnosed?"
            icon={<BeakerIcon className="w-4 h-4" />}
          >
            <Card className="card-base">
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Healthcare professionals may use medical history review and laboratory tests to assess diabetes. Common diagnostic tests include:
              </p>
              <div className="space-y-3">
                {DIABETES_DIAGNOSIS_TESTS.map((test, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg">
                    <CheckCircleIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-text">{test.name}</p>
                      <p className="text-xs text-text-muted mt-0.5">{test.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 leading-relaxed">
                  <strong>Note:</strong> JeevanSetu provides a risk assessment and does not diagnose diabetes. Always consult a qualified healthcare professional for diagnosis.
                </p>
              </div>
            </Card>
          </InfoSection>
        )}

        {/* ─── 13. Diabetes risk CTA ───────────────────────────────────── */}
        {isDiabetes && (
          <div className="mb-8">
            <Card className="card-base text-center py-6 px-4 sm:px-8">
              <h3 className="text-lg font-bold text-text mb-2">Assess Your Diabetes Risk</h3>
              <p className="text-sm text-text-secondary mb-5 max-w-md mx-auto">
                Use JeevanSetu's risk assessment tool to get an estimated risk score based on your health information.
              </p>
              <Link to={ROUTES.NEW_PREDICTION}>
                <Button
                  variant="primary"
                  className="inline-flex items-center gap-2 text-sm sm:text-base px-6 py-2.5"
                  id="check-diabetes-risk-btn"
                >
                  Check Your Diabetes Risk
                  <ChevronRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* ─── 14. No info available notice ─────────────────────────────── */}
        {!overviewText && !symptomsList.length && !causesList.length &&
          !riskFactorsList.length && !preventionList.length && !treatmentList.length &&
          !disease.when_to_see_doctor && !disease.additional_info && !disease.risk_message && (
          <div className="mb-8 p-4 rounded-lg bg-slate-50 border border-border text-center">
            <p className="text-sm text-text-muted">
              No additional information is currently available for this disease.
            </p>
          </div>
        )}

        {/* ─── 15. Medical Disclaimer ──────────────────────────────────── */}
        <div className="mb-8">
          <Alert
            variant="warning"
            message="JeevanSetu provides informational disease-risk assessments and health information. It is not a substitute for professional medical diagnosis or treatment."
          />
        </div>

        {/* ─── 16. Bottom Back Button ──────────────────────────────────── */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBackToDiseases}
            id="back-to-diseases-bottom-btn"
            className="inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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

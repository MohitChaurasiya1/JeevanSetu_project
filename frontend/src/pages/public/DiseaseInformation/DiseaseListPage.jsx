import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { getDiseases } from '../../../api/diseaseApi';
import {
  Card,
  Button,
  Input,
  Badge,
  LoadingState,
  ErrorState,
  EmptyState,
} from '../../../components/common';

// Temporary informational fallback data used ONLY when backend database contains 0 records
const FALLBACK_DISEASES = [
  {
    id: 1,
    name: 'Type 2 Diabetes',
    description:
      'A chronic metabolic condition characterized by insulin resistance or relative insulin deficiency, leading to persistently elevated blood glucose levels.',
    symptoms: ['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision'],
    recommended_specialist: 'Endocrinologist',
    category: 'Metabolic',
  },
  {
    id: 2,
    name: 'Hypertension',
    description:
      'A common cardiovascular condition where the long-term force of the blood against arterial walls is persistently elevated, increasing cardiovascular strain.',
    symptoms: ['Headaches', 'Shortness of breath', 'Dizziness', 'Chest discomfort'],
    recommended_specialist: 'Cardiologist',
    category: 'Cardiovascular',
  },
  {
    id: 3,
    name: 'Bronchial Asthma',
    description:
      'A chronic respiratory disease characterized by reversible bronchial inflammation, airway narrowing, and increased mucus production during flare-ups.',
    symptoms: ['Wheezing', 'Coughing', 'Chest tightness', 'Shortness of breath'],
    recommended_specialist: 'Pulmonologist',
    category: 'Respiratory',
  },
  {
    id: 4,
    name: 'Chronic Kidney Disease',
    description:
      'A gradual loss of kidney function over time, diminishing the organ\'s ability to filter metabolic wastes and surplus fluid from the bloodstream.',
    symptoms: ['Swollen ankles', 'Fatigue', 'Nausea', 'Changes in urination frequency'],
    recommended_specialist: 'Nephrologist',
    category: 'Renal',
  },
  {
    id: 5,
    name: 'Osteoarthritis',
    description:
      'A degenerative joint disorder resulting from the progressive breakdown of joint cartilage and underlying bone, causing joint discomfort and stiffness.',
    symptoms: ['Joint stiffness', 'Aching pain', 'Reduced flexibility', 'Swelling'],
    recommended_specialist: 'Rheumatologist',
    category: 'Musculoskeletal',
  },
  {
    id: 6,
    name: 'Migraine',
    description:
      'A neurological disorder that usually causes intense, pulsing headache episodes, frequently accompanied by extreme sensitivity to light, sound, or physical motion.',
    symptoms: ['Throbbing head pain', 'Light sensitivity', 'Sound sensitivity', 'Nausea'],
    recommended_specialist: 'Neurologist',
    category: 'Neurological',
  },
];

const DiseaseListPage = () => {
  const navigate = useNavigate();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Fetch disease records from backend API
  const fetchDiseaseList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDiseases();
      // Handle both paginated { results: [...] } and array formats
      let items = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response && Array.isArray(response.results)) {
        items = response.results;
      }

      if (items.length > 0) {
        setDiseases(items);
        setIsUsingFallback(false);
      } else {
        // Backend API is live, but database table has 0 records
        setDiseases(FALLBACK_DISEASES);
        setIsUsingFallback(true);
      }
    } catch (err) {
      console.error('Error loading disease list:', err);
      setError('Unable to load disease information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseaseList();
  }, []);

  // Filter diseases by search query
  const filteredDiseases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return diseases;

    return diseases.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      const specialistMatch = item.recommended_specialist?.toLowerCase().includes(query);
      const symptomMatch = Array.isArray(item.symptoms)
        ? item.symptoms.some((s) => (typeof s === 'string' ? s.toLowerCase().includes(query) : false))
        : typeof item.precautions === 'string'
        ? item.precautions.toLowerCase().includes(query)
        : false;

      return nameMatch || descMatch || specialistMatch || symptomMatch;
    });
  }, [diseases, searchQuery]);

  const handleViewDetails = (id) => {
    navigate(ROUTES.DISEASE_DETAILS.replace(':id', id));
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <div className="border-b border-border pb-6">
            <h1 className="text-3xl font-extrabold text-text tracking-tight sm:text-4xl">
              Diseases
            </h1>
            <p className="mt-2 text-base sm:text-lg text-text-secondary max-w-3xl">
              Explore information about diseases, symptoms and related health risks.
            </p>
          </div>
        </header>

        {/* Temporary Fallback Notification Banner */}
        {isUsingFallback && !loading && !error && (
          <aside
            aria-label="Informational Notice"
            className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-sm flex items-start gap-3"
          >
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold text-blue-900">
                Notice: Backend disease catalog currently contains no database records
              </p>
              <p className="text-blue-700 mt-0.5 leading-relaxed">
                Displaying temporary informational preview data for demonstration purposes. Real database records will automatically display when populated via the admin panel.
              </p>
            </div>
          </aside>
        )}

        {/* Search & Filter Section */}
        <section aria-label="Search and Filter" className="mb-8">
          <div className="max-w-xl">
            <div className="relative">
              <label htmlFor="disease-search" className="form-label block text-sm font-medium text-text mb-1">
                Search Diseases
              </label>
              <div className="relative">
                <Input
                  id="disease-search"
                  name="disease-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search diseases..."
                  className="pr-10"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content Section: Loading, Error, Empty, or Cards Grid */}
        <section aria-label="Disease Catalog">
          {loading ? (
            <div className="py-16">
              <LoadingState message="Loading disease information..." />
            </div>
          ) : error ? (
            <div className="py-12">
              <ErrorState
                title="Unable to load disease information"
                message={error}
                onRetry={fetchDiseaseList}
                retryLabel="Try Again"
              />
            </div>
          ) : filteredDiseases.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No Diseases Found"
                message={
                  searchQuery
                    ? `No diseases matched "${searchQuery}". Please try another keyword.`
                    : 'No disease information is available at the moment.'
                }
                action={
                  searchQuery ? (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDiseases.map((disease) => {
                // Extract symptoms array if available
                let symptomsList = [];
                if (Array.isArray(disease.symptoms)) {
                  symptomsList = disease.symptoms;
                } else if (typeof disease.symptoms === 'string') {
                  symptomsList = disease.symptoms.split(',').map((s) => s.trim()).filter(Boolean);
                }

                return (
                  <Card
                    key={disease.id}
                    className="flex flex-col h-full bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-colors"
                  >
                    {/* Card Header Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h2 className="text-lg font-bold text-text line-clamp-1">
                          {disease.name}
                        </h2>
                        {disease.recommended_specialist && (
                          <Badge variant="info" className="text-xs shrink-0">
                            {disease.recommended_specialist}
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-text-secondary line-clamp-3 mb-4 leading-relaxed">
                        {disease.description || 'No detailed description available.'}
                      </p>

                      {/* Symptoms Tags */}
                      {symptomsList.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                            Common Symptoms
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {symptomsList.slice(0, 4).map((symptom, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-text-secondary"
                              >
                                {typeof symptom === 'object' && symptom !== null ? symptom.name : symptom}
                              </span>
                            ))}
                            {symptomsList.length > 4 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-text-muted">
                                +{symptomsList.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Footer Action */}
                    <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {disease.category ? `Category: ${disease.category}` : 'Educational Info'}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(disease.id)}
                        className="text-xs py-1.5 px-3"
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Responsible Healthcare Educational Notice Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-xs text-text-muted max-w-2xl mx-auto leading-relaxed">
            Medical Disclaimer: All disease information displayed on JeevanSetu is strictly intended for educational reference and awareness. JeevanSetu does not provide medical diagnosis, clinical treatment plans, or drug prescriptions. Always seek guidance from a licensed physician or healthcare provider for medical advice.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default DiseaseListPage;

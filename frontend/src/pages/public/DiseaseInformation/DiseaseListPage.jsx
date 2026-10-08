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

const DiseaseListPage = () => {
  const navigate = useNavigate();

  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

      // Only use data coming from the backend/database
      setDiseases(items);
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

    if (!query) {
      return diseases;
    }

    return diseases.filter((item) => {
      const nameMatch = item.name?.toLowerCase().includes(query);

      const descMatch = item.description
        ?.toLowerCase()
        .includes(query);

      const specialistMatch = item.recommended_specialist
        ?.toLowerCase()
        .includes(query);

      const symptomMatch = Array.isArray(item.symptoms)
        ? item.symptoms.some((s) =>
          typeof s === 'string'
            ? s.toLowerCase().includes(query)
            : false
        )
        : typeof item.precautions === 'string'
          ? item.precautions.toLowerCase().includes(query)
          : false;

      return (
        nameMatch ||
        descMatch ||
        specialistMatch ||
        symptomMatch
      );
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

        {/* Search & Filter Section */}
        <section
          aria-label="Search and Filter"
          className="mb-8"
        >
          <div className="max-w-xl">
            <div className="relative">

              <label
                htmlFor="disease-search"
                className="form-label block text-sm font-medium text-text mb-1"
              >
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

        {/* Disease Catalog */}
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
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery('')}
                    >
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
                  symptomsList = disease.symptoms
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                }

                return (
                  <Card
                    key={disease.id}
                    className="flex flex-col h-full bg-surface border border-border rounded-xl p-6 shadow-sm hover:border-primary/40 transition-colors"
                  >

                    {/* Card Header Content */}
                    <div className="flex-1">

                      {/* Disease Name + Specialist */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">

                        <h2 className="text-lg font-bold text-text">
                          {disease.name}
                        </h2>

                        {disease.recommended_specialist && (
                          <Badge
                            variant="info"
                            className="text-xs"
                          >
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
                                {typeof symptom === 'object' &&
                                  symptom !== null
                                  ? symptom.name
                                  : symptom}
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

                    {/* Card Footer */}
                    <div className="pt-4 border-t border-border mt-auto flex items-center justify-between gap-3">

                      <span className="text-xs text-text-muted">
                        {disease.category
                          ? `Category: ${disease.category}`
                          : 'Educational Info'}
                      </span>

                      <Button
                        variant="outline"
                        onClick={() => handleViewDetails(disease.id)}
                        className="text-xs py-1.5 px-3 shrink-0"
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

        {/* Medical Disclaimer */}
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
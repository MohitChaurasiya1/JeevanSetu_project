import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat,
  FaShieldAlt,
  FaNotesMedical,
  FaUserCheck,
  FaArrowRight,
  FaStethoscope,
  FaClipboardList,
  FaLightbulb,
  FaBookMedical,
} from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Alert, Badge } from '../../../components/common';

const HomePage = () => {
  const features = [
    {
      icon: <FaHeartbeat className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Disease Risk Prediction',
      description: 'Assess potential disease risks based on your symptoms.',
    },
    {
      icon: <FaLightbulb className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Easy to Understand',
      description: 'Get clear prediction results designed for easy understanding.',
    },
    {
      icon: <FaBookMedical className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Health Information',
      description: 'Explore useful information about diseases, symptoms and risks.',
    },
    {
      icon: <FaShieldAlt className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Secure & User Friendly',
      description: 'Use a simple and accessible platform designed with users in mind.',
    },
  ];

  const steps = [
    {
      number: '01',
      icon: <FaClipboardList className="w-5 h-5 text-primary" aria-hidden="true" />,
      title: 'Enter Symptoms',
      description: 'Provide the symptoms you are experiencing to begin your assessment.',
    },
    {
      number: '02',
      icon: <FaStethoscope className="w-5 h-5 text-primary" aria-hidden="true" />,
      title: 'Get Prediction',
      description: 'JeevanSetu analyzes the symptoms you provide and generates an initial risk assessment.',
    },
    {
      number: '03',
      icon: <FaUserCheck className="w-5 h-5 text-primary" aria-hidden="true" />,
      title: 'Understand Your Result',
      description: 'Review the result and explore relevant health information to better understand your assessment.',
    },
  ];

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="section-container border-b border-border bg-white" aria-labelledby="hero-heading">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="flex flex-col items-start">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-4 sm:mb-5">
                AI-Powered Healthcare
              </span>
              <h1
                id="hero-heading"
                className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-text tracking-tight mb-4 sm:mb-5 leading-[1.2]"
              >
                Understand Your Health Risks with{' '}
                <span className="text-primary">JeevanSetu</span>
              </h1>
              <p className="text-base sm:text-body text-text-secondary mb-6 sm:mb-8 leading-relaxed max-w-xl">
                JeevanSetu helps you assess potential disease risks using
                symptom-based prediction and provides clear, easy-to-understand
                health information.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link to={ROUTES.NEW_PREDICTION} tabIndex={-1}>
                  <Button variant="primary" className="w-full sm:w-auto px-6 py-3">
                    Check Your Risk
                    <FaArrowRight className="ml-2 w-3.5 h-3.5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to={ROUTES.DISEASES} tabIndex={-1}>
                  <Button variant="outline" className="w-full sm:w-auto px-6 py-3">
                    Explore Diseases
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Right Visual (Clean UI-based Healthcare Assessment Visual) */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="card-base bg-background/60 p-6 sm:p-7 rounded-2xl border border-border w-full max-w-md shadow-card">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                      <FaHeartbeat className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text">Health Risk Assessment</h3>
                      <p className="text-xs text-text-muted">Prediction Overview</p>
                    </div>
                  </div>
                  <Badge variant="low">Low Risk</Badge>
                </div>

                {/* Visual Assessment Flow: Symptoms -> Assessment -> Result */}
                <div className="space-y-3">
                  <div className="bg-white p-3.5 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
                      <span className="text-xs font-semibold text-text">Symptoms</span>
                    </div>
                    <span className="text-xs text-text-secondary bg-slate-100 px-2 py-0.5 rounded">Recorded</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
                      <span className="text-xs font-semibold text-text">Assessment</span>
                    </div>
                    <span className="text-xs font-semibold text-success bg-emerald-50 px-2 py-0.5 rounded">Complete</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
                      <span className="text-xs font-semibold text-text">Result</span>
                    </div>
                    <span className="text-xs text-text-secondary bg-slate-100 px-2 py-0.5 rounded">Health Insights</span>
                  </div>
                </div>

                {/* Neutral Informational Note */}
                <div className="mt-5 pt-3 border-t border-border/80 flex items-center justify-between text-xs text-text-muted">
                  <span>Initial Assessment Tool</span>
                  <span className="text-primary font-medium">JeevanSetu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="section-container border-b border-border" aria-labelledby="features-heading">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 id="features-heading" className="text-2xl sm:text-h2 font-bold text-text mb-3">
              Why Choose JeevanSetu?
            </h2>
            <p className="text-sm sm:text-body text-text-secondary">
              A reliable platform designed to deliver clear, symptom-driven health risk assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full flex flex-col justify-between hover:border-border-dark transition-colors duration-200">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-light/60 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="section-container border-b border-border bg-white" aria-labelledby="how-it-works-heading">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="how-it-works-heading" className="text-2xl sm:text-h2 font-bold text-text mb-3">
              How It Works
            </h2>
            <p className="text-sm sm:text-body text-text-secondary">
              Get a simple health risk assessment in three easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={step.number}
                className="card-base p-6 sm:p-7 flex flex-col items-start relative h-full hover:border-border-dark transition-colors duration-200"
              >
                {/* Step indicator with circle number & icon */}
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {step.number}
                  </div>
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-text mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HEALTHCARE / PREDICTION INFORMATION SECTION */}
      <section className="section-container border-b border-border" aria-labelledby="healthcare-info-heading">
        <div className="page-container">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 sm:p-8 bg-white border border-border rounded-xl shadow-card">
              <div className="text-center mb-6">
                <h2 id="healthcare-info-heading" className="text-2xl sm:text-h2 font-bold text-text mb-3">
                  Make Better Health Decisions
                </h2>
                <p className="text-sm sm:text-body text-text-secondary leading-relaxed max-w-2xl mx-auto">
                  JeevanSetu provides an initial disease-risk assessment based on the symptoms you provide. It is designed to help users understand potential risks and explore relevant health information.
                </p>
              </div>

              {/* Medical Disclaimer Alert */}
              <Alert
                variant="warning"
                title="Important"
                message="JeevanSetu is an informational prediction tool and should not replace professional medical diagnosis or treatment."
                className="bg-amber-50/60 border-amber-200"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="section-container bg-white" aria-labelledby="cta-heading">
        <div className="page-container">
          <div className="card-base bg-background p-8 sm:p-12 text-center max-w-3xl mx-auto border border-border shadow-card">
            <h2 id="cta-heading" className="text-2xl sm:text-h2 font-bold text-text mb-3">
              Ready to Understand Your Health Risks?
            </h2>
            <p className="text-sm sm:text-body text-text-secondary mb-7 max-w-xl mx-auto leading-relaxed">
              Start a symptom-based assessment with JeevanSetu.
            </p>
            <div className="flex justify-center">
              <Link to={ROUTES.NEW_PREDICTION} tabIndex={-1}>
                <Button variant="primary" className="px-8 py-3 text-base">
                  Check Your Risk
                  <FaArrowRight className="ml-2 w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

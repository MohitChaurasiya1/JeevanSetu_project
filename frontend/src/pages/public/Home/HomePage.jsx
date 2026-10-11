import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat,
  FaShieldAlt,
  FaUserCheck,
  FaArrowRight,
  FaStethoscope,
  FaClipboardList,
  FaLightbulb,
  FaBookMedical,
  FaBrain,
  FaTint,
  FaProcedures,
} from 'react-icons/fa';

import { ROUTES } from '../../../constants/routes';
import { Button, Alert } from '../../../components/common';
import HeroMedicalVisual from '../../../components/hologram/HeroMedicalVisual';

const HomePage = () => {
  const features = [
    {
      icon: (
        <FaHeartbeat
          className="w-6 h-6 text-teal-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-teal-50 border-teal-100/80 text-teal-600',
      title: 'Disease Risk Prediction',
      description:
        'Assess potential health risks using validated clinical measurements and predictive intelligence.',
    },
    {
      icon: (
        <FaLightbulb
          className="w-6 h-6 text-amber-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-amber-50 border-amber-100/80 text-amber-600',
      title: 'Easy to Understand',
      description:
        'Receive clear prediction categories, risk factors, and actionable visual explanations.',
    },
    {
      icon: (
        <FaBookMedical
          className="w-6 h-6 text-blue-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-blue-50 border-blue-100/80 text-blue-600',
      title: 'Health Information',
      description:
        'Explore verified clinical details about diseases, common warning signs, and prevention guidelines.',
    },
    {
      icon: (
        <FaShieldAlt
          className="w-6 h-6 text-emerald-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-emerald-50 border-emerald-100/80 text-emerald-600',
      title: 'Secure & Confidential',
      description:
        'Engineered with strict privacy protections ensuring your medical data remains safe and protected.',
    },
  ];

  const healthAssessments = [
    {
      id: 'diabetes',
      icon: (
        <FaTint
          className="w-5 h-5 text-teal-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-teal-50 border-teal-200/70 text-teal-700',
      title: 'Diabetes Risk',
      description:
        'Assess potential diabetes probability using clinical glucose, BMI, and vital metabolic indicators.',
      available: true,
      route: ROUTES.NEW_PREDICTION,
    },
    {
      id: 'heart-disease',
      icon: (
        <FaHeartbeat
          className="w-5 h-5 text-rose-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-rose-50 border-rose-200/70 text-rose-700',
      title: 'Heart Disease',
      description:
        'AI assessment for potential cardiovascular risk based on blood pressure, cholesterol, and vital signs.',
      available: true,
      route: ROUTES.NEW_PREDICTION,
    },
    {
      id: 'stroke',
      icon: (
        <FaBrain
          className="w-5 h-5 text-indigo-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-indigo-50 border-indigo-200/70 text-indigo-700',
      title: 'Stroke Risk',
      description:
        'Targeted neural assessment designed to evaluate cerebrovascular health and stroke warning markers.',
      available: false,
    },
    {
      id: 'kidney',
      icon: (
        <FaProcedures
          className="w-5 h-5 text-amber-600"
          aria-hidden="true"
        />
      ),
      iconBg: 'bg-amber-50 border-amber-200/70 text-amber-700',
      title: 'Kidney Disease',
      description:
        'Specialized predictive module identifying chronic renal function trends and health biomarkers.',
      available: false,
    },
  ];

  const steps = [
    {
      number: '01',
      icon: (
        <FaClipboardList
          className="w-5 h-5 text-primary"
          aria-hidden="true"
        />
      ),
      title: 'Enter Health Information',
      description:
        'Provide the required health measurements and vitals through our intuitive, guided form.',
    },
    {
      number: '02',
      icon: (
        <FaStethoscope
          className="w-5 h-5 text-primary"
          aria-hidden="true"
        />
      ),
      title: 'Get Prediction',
      description:
        'JeevanSetu processes your clinical measurements and instantly generates your evaluated risk score.',
    },
    {
      number: '03',
      icon: (
        <FaUserCheck
          className="w-5 h-5 text-primary"
          aria-hidden="true"
        />
      ),
      title: 'Understand Your Result',
      description:
        'Review transparent risk factors and consult relevant disease information for preventive health steps.',
    },
  ];

  return (
    <div className="w-full">

      {/* 1. HERO SECTION */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="hero-heading"
      >
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">

            {/* Hero Left Content */}
            <div className="flex flex-col items-start">

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary-light text-primary mb-4 sm:mb-5 border border-primary/20 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI-Powered Healthcare
              </span>

              <h1
                id="hero-heading"
                className="text-[32px] md:text-[40px] lg:text-[48px] font-bold text-text tracking-tight mb-4 sm:mb-5 leading-[1.2]"
              >
                Understand Your Health Risks with{' '}
                <span className="text-primary bg-gradient-to-r from-teal-700 via-primary to-teal-600 bg-clip-text text-transparent">
                  JeevanSetu
                </span>
              </h1>

              <p className="text-base sm:text-body text-text-secondary mb-6 sm:mb-8 leading-relaxed max-w-xl">
                JeevanSetu helps you assess potential health risks using
                relevant medical measurements and provides clear,
                easy-to-understand health information.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">

                <Link to={ROUTES.NEW_PREDICTION} tabIndex={-1}>
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 font-semibold"
                  >
                    <span>Check Your Risk</span>
                    <FaArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

                <Link to={ROUTES.DISEASES} tabIndex={-1}>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 font-semibold"
                  >
                    Explore Diseases
                  </Button>
                </Link>

              </div>

              {/* Trust highlights */}
              <div className="mt-8 pt-6 border-t border-border/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <FaShieldAlt className="text-primary w-3.5 h-3.5 flex-shrink-0" />
                  100% Confidential
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaUserCheck className="text-primary w-3.5 h-3.5 flex-shrink-0" />
                  Verified Algorithms
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaHeartbeat className="text-primary w-3.5 h-3.5 flex-shrink-0" />
                  Instant Risk Scores
                </span>
              </div>

            </div>

            {/* Hero Right Visual */}
            <div className="w-full flex justify-center lg:justify-end">
              <HeroMedicalVisual />
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="how-it-works-heading"
      >
        <div className="page-container">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-3">
              Simple 3-Step Process
            </span>

            <h2
              id="how-it-works-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3 tracking-tight"
            >
              How It Works
            </h2>

            <p className="text-sm sm:text-body text-text-secondary">
              Get a reliable health risk assessment in three easy steps.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

            {steps.map((step) => (

              <div
                key={step.number}
                className="bg-white rounded-2xl border border-border/80 p-6 sm:p-7 flex flex-col items-start relative h-full hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-2xs"
              >

                {/* Step indicator */}
                <div className="flex items-center justify-between w-full mb-5">

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {step.number}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-primary-light/70 flex items-center justify-center">
                    {step.icon}
                  </div>

                </div>

                <h3 className="text-lg font-bold text-text mb-2.5 tracking-tight">
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

      {/* 3. HEALTH RISK ASSESSMENTS SECTION */}
      <section
        className="section-container border-b border-border bg-background/50"
        aria-labelledby="health-risk-heading"
      >
        <div className="page-container">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-3">
              Predictive Diagnostics
            </span>

            <h2
              id="health-risk-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3 tracking-tight"
            >
              Health Risk Assessments
            </h2>

            <p className="text-sm sm:text-body text-text-secondary">
              Choose an assessment to evaluate your potential health risks with clinically-informed models.
            </p>

          </div>

          {/* 4 cards in one row on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

            {healthAssessments.map((assessment) => (

              <div
                key={assessment.title}
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col p-6 h-full ${
                  assessment.available
                    ? 'border-border/80 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5'
                    : 'border-dashed border-border/80 bg-slate-50/50 hover:border-border'
                }`}
              >

                {/* Icon + Status Badge in one header row */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-2xs transition-transform duration-200 ${assessment.iconBg}`}
                  >
                    {assessment.icon}
                  </div>

                  {assessment.available ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200/60">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">

                  <h3 className="text-lg font-bold text-text mb-2 tracking-tight">
                    {assessment.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {assessment.description}
                  </p>

                </div>

                {/* Action - Always aligned at bottom */}
                <div className="mt-6 pt-2">
                  {assessment.available ? (
                    <Link
                      to={assessment.route || ROUTES.NEW_PREDICTION}
                      className="block w-full focus:outline-none"
                    >
                      <Button
                        variant="primary"
                        className="w-full justify-center group shadow-xs hover:shadow-md transition-all font-semibold rounded-xl"
                      >
                        <span>Check Risk</span>
                        <FaArrowRight
                          className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                          aria-hidden="true"
                        />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      disabled
                      className="w-full justify-center opacity-60 text-xs font-medium cursor-not-allowed border border-dashed border-border text-text-muted bg-slate-50/80 rounded-xl"
                    >
                      Coming Soon
                    </Button>
                  )}
                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* 4. FEATURES SECTION */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="features-heading"
      >
        <div className="page-container">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-3">
              Platform Benefits
            </span>

            <h2
              id="features-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3 tracking-tight"
            >
              Why Choose JeevanSetu?
            </h2>

            <p className="text-sm sm:text-body text-text-secondary">
              A reliable platform designed to deliver clear, validated, and understandable health risk assessments.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-border/80 p-6 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 shadow-2xs"
              >
                <div>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border shadow-2xs ${feature.iconBg}`}>
                    {feature.icon}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-text mb-2 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* 5. HEALTHCARE / PREDICTION INFORMATION SECTION */}
      <section
        className="section-container border-b border-border bg-background/40"
        aria-labelledby="healthcare-info-heading"
      >
        <div className="page-container">

          <div className="max-w-3xl mx-auto">

            <div className="bg-white rounded-2xl border border-border/80 p-6 sm:p-8 shadow-card">

              <div className="text-center mb-6">

                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-primary border border-teal-100 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                  <FaStethoscope className="w-6 h-6" />
                </div>

                <h2
                  id="healthcare-info-heading"
                  className="text-2xl sm:text-h2 font-bold text-text mb-3 tracking-tight"
                >
                  Make Better Health Decisions
                </h2>

                <p className="text-sm sm:text-body text-text-secondary leading-relaxed max-w-2xl mx-auto">
                  JeevanSetu provides early statistical risk indications using clinical parameters. It helps you proactively understand potential health patterns before they develop.
                </p>

              </div>

              {/* Medical Disclaimer */}
              <Alert
                variant="warning"
                title="Clinical Disclaimer"
                message="JeevanSetu is an informational prediction tool and does not provide formal medical diagnosis or prescription. Always consult a qualified physician or healthcare provider for diagnosis and treatment plans."
                className="bg-amber-50/70 border-amber-200/80 rounded-xl"
              />

            </div>

          </div>

        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section
        className="section-container bg-white"
        aria-labelledby="cta-heading"
      >
        <div className="page-container">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-teal-50/30 border border-primary/20 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">

            <div className="relative z-10">

              <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-primary text-white mb-4 shadow-2xs">
                Take Charge of Your Wellness
              </span>

              <h2
                id="cta-heading"
                className="text-2xl sm:text-h2 font-bold text-text mb-3 tracking-tight"
              >
                Ready to Understand Your Health Risks?
              </h2>

              <p className="text-sm sm:text-body text-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
                Take our fast, secure, and confidential health risk assessment in less than 2 minutes.
              </p>

              <div className="flex justify-center">

                <Link to={ROUTES.NEW_PREDICTION} tabIndex={-1}>
                  <Button
                    variant="primary"
                    className="px-8 py-3.5 text-base font-semibold shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all group rounded-xl"
                  >
                    <span>Check Your Risk Now</span>
                    <FaArrowRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 flex-shrink-0"
                      aria-hidden="true"
                    />
                  </Button>
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default HomePage;
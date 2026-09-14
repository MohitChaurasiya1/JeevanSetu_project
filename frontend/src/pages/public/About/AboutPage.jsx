import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeartbeat,
  FaBookMedical,
  FaUserCheck,
  FaArrowRight,
  FaCompass,
  FaUserCircle,
} from 'react-icons/fa';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Alert } from '../../../components/common';

const AboutPage = () => {
  const helpCards = [
    {
      icon: <FaHeartbeat className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Symptom-Based Assessment',
      description:
        'Provide your symptoms to receive an initial assessment of potential disease risk.',
    },
    {
      icon: <FaBookMedical className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Clear Health Information',
      description:
        'Explore understandable information about diseases, symptoms and related health risks.',
    },
    {
      icon: <FaUserCheck className="w-6 h-6 text-primary" aria-hidden="true" />,
      title: 'Simple User Experience',
      description:
        'Use a straightforward interface designed to make health information easier to explore.',
    },
  ];

  // Team members
  // Add image path when a member's photo is available.
  const teamMembers = [
    {
      name: 'ABHISHEK YADAV',
      role: 'TEAM LEADER',
      contribution: '-BACKEND-DEVELOPER',
      image: '/images/teams/Abhishek.jpeg',
    },
    {
      name: 'MOHIT CHAUASIYA',
      role: 'TEAM MEMBER',
      contribution: '-FRONTEND-DEVELOPER\n-OVERALL-TESTING',
      image: '/images/teams/mohit.png',
    },
    {
      name: 'TUSHAR RAWAT',
      role: 'TEAM MEMBER',
      contribution: '-AI-MODEL-DEVELOPER',
      image: '/images/teams/Tushar.jpeg',
    },
    {
      name: 'SATYA PRAKASH YADAV',
      role: 'TEAM MEMBER',
      contribution: '-DATA COLLECTOR AND DATA VISUALIZATION',
      image: '/images/teams/Satya.jpeg',
    },
  ];

  return (
    <div className="w-full">

      {/* ==================== SECTION 1 — ABOUT JEEVANSETU ==================== */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="about-page-title"
      >
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center">

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-light text-primary mb-4">
              Healthcare Overview
            </span>

            <h1
              id="about-page-title"
              className="text-3xl sm:text-4xl lg:text-h1 font-bold text-text tracking-tight mb-5"
            >
              About JeevanSetu
            </h1>

            <p className="text-base sm:text-body text-text-secondary leading-relaxed">
              JeevanSetu is a healthcare-focused platform designed to help
              users understand potential disease risks through symptom-based
              prediction and accessible health information.
            </p>

          </div>
        </div>
      </section>

      {/* ==================== SECTION 2 — OUR PURPOSE ==================== */}
      <section
        className="section-container border-b border-border"
        aria-labelledby="purpose-heading"
      >
        <div className="page-container">
          <div className="max-w-3xl mx-auto">

            <Card className="p-6 sm:p-8 bg-white border border-border rounded-xl shadow-card text-center sm:text-left">

              <h2
                id="purpose-heading"
                className="text-2xl sm:text-h2 font-bold text-text mb-3"
              >
                Our Purpose
              </h2>

              <p className="text-sm sm:text-body text-text-secondary leading-relaxed">
                JeevanSetu aims to make health risk information easier to
                understand by providing an initial symptom-based assessment
                in a simple and user-friendly way.
              </p>

            </Card>

          </div>
        </div>
      </section>

      {/* ==================== SECTION 3 — HOW JEEVANSETU HELPS ==================== */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="helps-heading"
      >
        <div className="page-container">

          <div className="text-center max-w-2xl mx-auto mb-10">

            <h2
              id="helps-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3"
            >
              How JeevanSetu Helps
            </h2>

            <p className="text-sm sm:text-body text-text-secondary">
              Key ways our platform assists you in understanding health risk
              factors.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {helpCards.map((card) => (
              <Card
                key={card.title}
                className="h-full flex flex-col justify-between p-6 hover:border-border-dark transition-colors duration-200"
              >
                <div>

                  <div className="w-12 h-12 rounded-xl bg-primary-light/60 flex items-center justify-center mb-4">
                    {card.icon}
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-text mb-2">
                    {card.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {card.description}
                  </p>

                </div>
              </Card>
            ))}

          </div>
        </div>
      </section>

      {/* ==================== SECTION 4 — MEET OUR TEAM ==================== */}
      <section
        className="section-container border-b border-border"
        aria-labelledby="team-heading"
      >
        <div className="page-container">

          <div className="text-center max-w-2xl mx-auto mb-10">

            <h2
              id="team-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3"
            >
              Meet Our Team
            </h2>

            <p className="text-sm sm:text-body text-text-secondary">
              JeevanSetu was developed collaboratively by our project team.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="h-full flex flex-col justify-between p-6 hover:border-border-dark transition-colors duration-200"
              >
                <div>

                  {/* Team Member Image / Placeholder */}
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center text-primary mb-4">

                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle
                        className="w-10 h-10"
                        aria-hidden="true"
                      />
                    )}

                  </div>

                  {/* Member Name */}
                  <h3 className="text-base font-semibold text-text mb-1">
                    {member.name}
                  </h3>

                  {/* Member Role */}
                  <p className="text-xs font-medium text-primary mb-3">
                    {member.role}
                  </p>

                  {/* Contribution */}
                  <div className="pt-3 border-t border-border">

                    <span className="text-xs font-medium text-text-muted block mb-1">
                      Contribution:
                    </span>

                    <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                      {member.contribution}
                    </p>

                  </div>

                </div>
              </Card>
            ))}

          </div>
        </div>
      </section>

      {/* ==================== SECTION 5 — RESPONSIBLE USE ==================== */}
      <section
        className="section-container border-b border-border bg-white"
        aria-labelledby="responsible-use-heading"
      >
        <div className="page-container">

          <div className="max-w-3xl mx-auto">

            <Card className="p-6 sm:p-8 bg-white border border-border rounded-xl shadow-card">

              <div className="mb-5">

                <h2
                  id="responsible-use-heading"
                  className="text-2xl sm:text-h2 font-bold text-text mb-3"
                >
                  Responsible Use
                </h2>

                <p className="text-sm sm:text-body text-text-secondary leading-relaxed">
                  JeevanSetu is designed to provide informational support and
                  an initial disease-risk assessment. It is not intended to
                  provide a medical diagnosis or replace professional medical
                  advice.
                </p>

              </div>

              {/* Responsible Use Disclaimer Alert */}
              <Alert
                variant="warning"
                title="Medical Disclaimer"
                message="JeevanSetu is an informational prediction tool and should not replace professional medical diagnosis, advice, or treatment. Always seek the advice of a qualified healthcare provider with any medical questions."
                className="bg-amber-50/60 border-amber-200"
              />

            </Card>

          </div>
        </div>
      </section>

      {/* ==================== SECTION 6 — EXPLORE JEEVANSETU ==================== */}
      <section
        className="section-container bg-white"
        aria-labelledby="about-cta-heading"
      >
        <div className="page-container">

          <div className="card-base bg-background p-8 sm:p-12 text-center max-w-3xl mx-auto border border-border shadow-card">

            <h2
              id="about-cta-heading"
              className="text-2xl sm:text-h2 font-bold text-text mb-3"
            >
              Explore JeevanSetu
            </h2>

            <p className="text-sm sm:text-body text-text-secondary mb-7 max-w-xl mx-auto leading-relaxed">
              Start by exploring diseases and health information or begin a
              symptom-based risk assessment.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">

              <Link to={ROUTES.DISEASES} tabIndex={-1}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3 text-base"
                >
                  <FaCompass
                    className="mr-2 w-4 h-4"
                    aria-hidden="true"
                  />
                  Explore Diseases
                </Button>
              </Link>

              <Link to={ROUTES.NEW_PREDICTION} tabIndex={-1}>
                <Button
                  variant="primary"
                  className="w-full sm:w-auto px-6 py-3 text-base"
                >
                  Check Your Risk
                  <FaArrowRight
                    className="ml-2 w-3.5 h-3.5"
                    aria-hidden="true"
                  />
                </Button>
              </Link>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
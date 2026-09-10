import React from 'react';
import { Route } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Public Pages
import HomePage from '../pages/public/Home/HomePage';
import HowItWorksPage from '../pages/public/HowItWorks/HowItWorksPage';
import AboutPage from '../pages/public/About/AboutPage';
import DiseaseListPage from '../pages/public/DiseaseInformation/DiseaseListPage';
import DiseaseDetailsPage from '../pages/public/DiseaseInformation/DiseaseDetailsPage';
import ContactPage from '../pages/public/Contact/ContactPage';
import PrivacyPolicyPage from '../pages/public/PrivacyPolicy/PrivacyPolicyPage';
import TermsPage from '../pages/public/Terms/TermsPage';
import NotFoundPage from '../pages/public/NotFound/NotFoundPage';

const PublicRoutes = () => (
  <>
    <Route index element={<HomePage />} />
    <Route path={ROUTES.ABOUT} element={<AboutPage />} />
    <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorksPage />} />
    <Route path={ROUTES.DISEASES} element={<DiseaseListPage />} />
    <Route path={ROUTES.DISEASE_DETAILS} element={<DiseaseDetailsPage />} />
    <Route path={ROUTES.CONTACT} element={<ContactPage />} />
    <Route path={ROUTES.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
    <Route path={ROUTES.TERMS} element={<TermsPage />} />
  </>
);

export default PublicRoutes;

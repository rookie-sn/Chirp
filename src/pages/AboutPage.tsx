import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AboutModal } from '../components/AboutModal';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return <AboutModal onBack={() => navigate('/')} />;
};

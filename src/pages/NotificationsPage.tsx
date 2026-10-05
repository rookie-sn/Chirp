import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationsView } from '../components/NotificationsView';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NotificationsView
      onBack={() => navigate('/')}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
    />
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessagesView } from '../components/MessagesView';
import { CURRENT_USER } from '../services/api';

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MessagesView
      currentUser={CURRENT_USER}
      onBack={() => navigate('/')}
      onUserClick={(userId) => navigate(`/profile/${userId}`)}
    />
  );
};

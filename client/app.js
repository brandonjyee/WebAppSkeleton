import React from 'react';

import ErrorBoundary from './ErrorBoundary';
import Routes from './routes'
import Navbar from './components/Navbar'

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <Navbar />
        <Routes />
      </ErrorBoundary>
    </div>
  );
};

export default App;

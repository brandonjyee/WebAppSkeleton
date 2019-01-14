import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import Example from './components/Example';

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <p>My App</p>
        <Example />
      </ErrorBoundary>
    </div>
  );
};

export default App;

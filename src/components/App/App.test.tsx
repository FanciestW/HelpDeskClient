import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByLabelText } = render(<App />);
  const menuButton = getByLabelText('menu');
  expect(menuButton).toBeInTheDocument();
});

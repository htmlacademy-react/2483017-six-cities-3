import { render, screen } from '@testing-library/react';
import ServerError from './server-error';

describe('Component: ServerError', () => {
  it('should render server error message', () => {
    render(<ServerError />);

    const errorMessage = screen.getByText(
      'Failed to load data. Please try again later.'
    );

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('page__error');
  });
});

import { render, screen } from '@testing-library/react';
import { withHistory } from '../../utils/mock-component';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('should render correct', () => {
    const expectedTitleText = /404 Not Found/i;
    const expectedDescriptionText = /Page not found/i;
    const expectedLinkText = /Go to main page/i;

    render(withHistory(<NotFoundPage />));

    expect(screen.getByText(expectedTitleText)).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionText)).toBeInTheDocument();
    expect(screen.getByText(expectedLinkText)).toBeInTheDocument();
  });
});

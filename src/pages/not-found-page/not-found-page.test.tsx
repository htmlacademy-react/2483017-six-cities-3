import { render, screen } from '@testing-library/react';
import { AppRoute } from '../../const';
import { withHistory } from '../../utils/mock-component';
import NotFoundPage from './not-found-page';

vi.mock('../../components/header/header', () => ({
  default: () => <div>Header</div>,
}));

describe('Component: NotFoundPage', () => {
  it('should render correct', () => {
    const expectedTitleText = /404 Not Found/i;
    const expectedDescriptionText = /Page not found/i;
    const expectedLinkText = /Go to main page/i;

    render(withHistory(<NotFoundPage />));

    expect(screen.getByText('Header')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: expectedTitleText,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(expectedDescriptionText)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', {
        name: expectedLinkText,
      })
    ).toHaveAttribute('href', AppRoute.Main);
  });
});

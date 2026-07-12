import { render, screen } from '@testing-library/react';
import { AppRoute } from '../../const';
import { withHistory } from '../../utils/mock-component';
import Header from './header';

vi.mock('./header-navigation', () => ({
  default: () => <nav>Header navigation</nav>,
}));

describe('Component: Header', () => {
  it('should render header logo and navigation', () => {
    render(
      withHistory(
        <Header />,
      ),
    );

    const logo = screen.getByRole('img', {
      name: '6 cities logo',
    });

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'img/logo.svg');

    expect(
      screen.getByRole('navigation'),
    ).toBeInTheDocument();
  });

  it('should render logo link to main page', () => {
    render(
      withHistory(
        <Header />,
      ),
    );

    const logoLink = screen
      .getByRole('img', {
        name: '6 cities logo',
      })
      .closest('a');

    expect(logoLink).toHaveAttribute(
      'href',
      AppRoute.Main,
    );
  });

  it('should add active class to logo link on main page', () => {
    render(
      withHistory(
        <Header isMainPage />,
      ),
    );

    const logoLink = screen
      .getByRole('img', {
        name: '6 cities logo',
      })
      .closest('a');

    expect(logoLink).toHaveClass(
      'header__logo-link--active',
    );
  });

  it('should not add active class to logo link outside main page', () => {
    render(
      withHistory(
        <Header />,
      ),
    );

    const logoLink = screen
      .getByRole('img', {
        name: '6 cities logo',
      })
      .closest('a');

    expect(logoLink).not.toHaveClass(
      'header__logo-link--active',
    );
  });
});

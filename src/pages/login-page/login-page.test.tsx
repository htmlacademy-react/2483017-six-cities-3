import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import {
  AppRoute,
  AuthorizationStatus,
} from '../../const';
import {
  useAppDispatch,
  useAppSelector,
} from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { withHistory } from '../../utils/mock-component';
import LoginPage from './login-page';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  loginAction: vi.fn(),
}));

vi.mock('../../components/random-city/random-city', () => ({
  default: () => (
    <div data-testid="random-city">
      Random city
    </div>
  ),
}));

describe('Component: LoginPage', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);

    vi.mocked(useAppSelector).mockReturnValue(
      AuthorizationStatus.NoAuth,
    );
  });

  it('should render login form with valid input attributes', () => {
    render(
      withHistory(<LoginPage />),
    );

    const emailInput = screen.getByRole('textbox', {
      name: 'E-mail',
    });

    const passwordInput = screen.getByLabelText('Password');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Sign in',
      }),
    ).toBeInTheDocument();

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();

    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute(
      'pattern',
      '^(?=.*[A-Za-z])(?=.*\\d).+$',
    );

    expect(
      screen.getByRole('button', {
        name: 'Sign in',
      }),
    ).toBeInTheDocument();
  });

  it('should render link to main page and random city component', () => {
    render(
      withHistory(<LoginPage />),
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

    expect(
      screen.getByTestId('random-city'),
    ).toBeInTheDocument();
  });

  it('should dispatch "loginAction" with entered email and password when user submits form', async () => {
    const user = userEvent.setup();
    const mockAuthData = {
      email: 'test@test.com',
      password: 'password1',
    };

    render(
      withHistory(<LoginPage />),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'E-mail',
      }),
      mockAuthData.email,
    );

    await user.type(
      screen.getByLabelText('Password'),
      mockAuthData.password,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Sign in',
      }),
    );

    expect(loginAction).toHaveBeenCalledTimes(1);

    expect(loginAction).toHaveBeenCalledWith(
      mockAuthData,
    );

    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('should redirect authorized user to main page', () => {
    vi.mocked(useAppSelector).mockReturnValue(
      AuthorizationStatus.Auth,
    );

    render(
      withHistory(
        <Routes>
          <Route
            path={AppRoute.Login}
            element={<LoginPage />}
          />

          <Route
            path={AppRoute.Main}
            element={<div>Main page</div>}
          />
        </Routes>,
        [AppRoute.Login],
      ),
    );

    expect(
      screen.getByText('Main page'),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Sign in',
      }),
    ).not.toBeInTheDocument();
  });
});

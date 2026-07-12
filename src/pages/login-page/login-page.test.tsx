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
import { makeFakeAuthData } from '../../utils/mocks';
import LoginPage from './login-page';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../../store/api-actions', () => ({
  loginAction: vi.fn(),
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

  it('should render login form', () => {
    render(
      withHistory(<LoginPage />),
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Sign in',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('textbox', {
        name: 'E-mail',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Password'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: 'Sign in',
      }),
    ).toBeInTheDocument();
  });

  it('should render links to main page', () => {
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
      screen.getByRole('link', {
        name: 'Amsterdam',
      }),
    ).toHaveAttribute(
      'href',
      AppRoute.Main,
    );
  });

  it('should dispatch "loginAction" with entered email and password when user submits form', async () => {
    const user = userEvent.setup();
    const mockAuthData = makeFakeAuthData();

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

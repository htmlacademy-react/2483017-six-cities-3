import { Link, Navigate } from 'react-router-dom';
import { FormEvent } from 'react';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginAction } from '../../store/api-actions';
import { selectAuthorizationStatus } from '../../store/user-process';
import RandomCity from '../../components/random-city/random-city';

function LoginPage() {
  const dispatch = useAppDispatch();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const form = evt.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    if (typeof email === 'string' && typeof password === 'string') {
      dispatch(loginAction({
        email,
        password,
      }));
    }
  };

  if (authorizationStatus === AuthorizationStatus.Auth) {
    return <Navigate to={AppRoute.Main} replace />;
  }

  return (
    <div className="page page--gray page--login">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link" to={AppRoute.Main}>
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form
              className="login__form form"
              action="#"
              method="post"
              onSubmit={handleSubmit}
            >
              <div className="login__input-wrapper form__input-wrapper">
                <label
                  className="visually-hidden"
                  htmlFor="email"
                >
                  E-mail
                </label>
                <input
                  className="login__input form__input"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label
                  className="visually-hidden"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="login__input form__input"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  pattern="^(?=.*[A-Za-z])(?=.*\d).+$"
                  title="Password must contain at least one letter and one number"
                  required
                />
              </div>
              <button className="login__submit form__submit button" type="submit">Sign in</button>
            </form>
          </section>
          <RandomCity />
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

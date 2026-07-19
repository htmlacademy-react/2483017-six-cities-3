import { Link } from 'react-router-dom';
import { MouseEvent } from 'react';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logoutAction } from '../../store/api-actions';
import { selectFavoriteOffersCount } from '../../store/offers';
import { selectAuthorizationStatus, selectUserEmail } from '../../store/user-process';

function HeaderNavigation() {
  const dispatch = useAppDispatch();

  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const favoriteOffersCount = useAppSelector(selectFavoriteOffersCount);
  const userEmail = useAppSelector(selectUserEmail);

  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const handleLogoutClick = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    dispatch(logoutAction());
  };

  return (
    <nav className="header__nav">
      <ul className="header__nav-list">
        {isAuthorized ? (
          <>
            <li className="header__nav-item user">
              <Link
                className="header__nav-link header__nav-link--profile"
                to={AppRoute.Favorites}
              >
                <div className="header__avatar-wrapper user__avatar-wrapper" />
                <span className="header__user-name user__name">{userEmail}</span>
                <span className="header__favorite-count">{favoriteOffersCount}</span>
              </Link>
            </li>

            <li className="header__nav-item">
              <Link
                className="header__nav-link"
                to={AppRoute.Main}
                onClick={handleLogoutClick}
              >
                <span className="header__signout">Sign Out</span>
              </Link>
            </li>
          </>
        ) : (
          <li className="header__nav-item user">
            <Link
              className="header__nav-link header__nav-link--profile"
              to={AppRoute.Login}
            >
              <div className="header__avatar-wrapper user__avatar-wrapper" />
              <span className="header__login">Sign in</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default HeaderNavigation;

import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { AppRoute } from '../../const';
import HeaderNavigation from './header-navigation';

type HeaderProps = {
  isMainPage?: boolean;
};

function Header({isMainPage = false}: HeaderProps){
  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Link
              className={classNames(
                'header__logo-link',
                {'header__logo-link--active': isMainPage}
              )}
              to={AppRoute.Main}
            >
              <img
                className="header__logo"
                src="img/logo.svg"
                alt="6 cities logo"
                width="81"
                height="41"
              />
            </Link>
          </div>

          <HeaderNavigation />
        </div>
      </div>
    </header>
  );
}

const MemoizedHeader = memo(Header);

export default MemoizedHeader;

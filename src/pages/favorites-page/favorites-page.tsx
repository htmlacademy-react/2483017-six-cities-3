import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute } from '../../const';
import Header from '../../components/header/header';
import FavoritesList from '../../components/favorites/favorites-list';
import { fetchFavoriteOffersAction } from '../../store/api-actions';
import {
  selectFavoriteOffers,
  selectFavoriteOffersLoadingErrorStatus,
} from '../../store/offers';
import FavoritesEmpty from '../../components/favorites/favorites-empty';
import ServerError from '../../components/server-error/server-error';

function FavoritesPage() {
  const dispatch = useAppDispatch();

  const favoriteOffers = useAppSelector(selectFavoriteOffers);
  const isFavoritesEmpty = favoriteOffers.length === 0;

  const isFavoriteOffersLoadingError = useAppSelector(
    selectFavoriteOffersLoadingErrorStatus,
  );

  useEffect(() => {
    dispatch(fetchFavoriteOffersAction());
  }, [dispatch]);

  if (isFavoriteOffersLoadingError) {
    return (
      <div className="page">
        <Header />

        <main className="page__main page__main--favorites">
          <ServerError />
        </main>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        'page',
        { 'page--favorites-empty': isFavoritesEmpty },
      )}
    >
      <Header />

      <main
        className={classNames(
          'page__main',
          'page__main--favorites',
          { 'page__main--favorites-empty': isFavoritesEmpty },
        )}
      >
        {isFavoritesEmpty ? (
          <FavoritesEmpty />
        ) : (
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <FavoritesList />
            </section>
          </div>
        )}
      </main>
      <footer className="footer container">
        <Link className="footer__logo-link" to={AppRoute.Main}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width="64"
            height="33"
          />
        </Link>
      </footer>
    </div>
  );
}

export default FavoritesPage;

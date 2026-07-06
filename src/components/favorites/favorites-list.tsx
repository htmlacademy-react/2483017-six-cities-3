import { useMemo } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { AppRoute, STAR_WIDTH_PERCENT } from '../../const';
import { useAppSelector } from '../../hooks';
import { selectFavoriteOffers } from '../../store/offers';
import CardFavoriteButton from '../offers/card-favorite-button';
import { getFavoriteOffersByCity } from '../../utils';


function FavoritesList() {
  const favoriteOffers = useAppSelector(selectFavoriteOffers);

  const favoriteOffersByCity = useMemo(
    () => getFavoriteOffersByCity(favoriteOffers),
    [favoriteOffers]
  );

  const favoriteCities = Object.keys(favoriteOffersByCity);


  return (
    <ul className="favorites__list">
      {favoriteCities.map((city) => (
        <li className="favorites__locations-items" key={city}>
          <div className="favorites__locations locations locations--current">
            <div className="locations__item">
              <a className="locations__item-link" href="#">
                <span>{city}</span>
              </a>
            </div>
          </div>

          <div className="favorites__places">
            {favoriteOffersByCity[city].map((offer) => {
              const offerPath = generatePath(AppRoute.Offer, {id: offer.id});

              return (
                <article key={offer.id} className="favorites__card place-card">
                  {offer.isPremium && (
                    <div className="place-card__mark">
                      <span>Premium</span>
                    </div>
                  )}

                  <div className="favorites__image-wrapper place-card__image-wrapper">
                    <Link to={offerPath}>
                      <img
                        className="place-card__image"
                        src={offer.previewImage}
                        width="150"
                        height="110"
                        alt="Place image"
                      />
                    </Link>
                  </div>

                  <div className="favorites__card-info place-card__info">
                    <div className="place-card__price-wrapper">
                      <div className="place-card__price">
                        <b className="place-card__price-value">&euro;{offer.price}</b>
                        <span className="place-card__price-text">&#47;&nbsp;night</span>
                      </div>

                      <CardFavoriteButton
                        offerId={offer.id}
                        isFavorite={offer.isFavorite}
                      />
                    </div>

                    <div className="place-card__rating rating">
                      <div className="place-card__stars rating__stars">
                        <span style={{width: `${offer.rating * STAR_WIDTH_PERCENT}%`}}></span>
                        <span className="visually-hidden">Rating</span>
                      </div>
                    </div>

                    <h2 className="place-card__name">
                      <Link to={offerPath}>{offer.title}</Link>
                    </h2>

                    <p className="place-card__type">{offer.type}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FavoritesList;

import classNames from 'classnames';
import { generatePath, Link } from 'react-router-dom';
import { AppRoute, STAR_WIDTH_PERCENT } from '../../const';
import { Offer } from '../../types/offer';

type NearbyOfferProps = {
  offer: Offer;
};

function NearbyOffer({offer}: NearbyOfferProps) {
  const {
    id,
    title,
    type,
    price,
    rating,
    previewImage,
    isFavorite,
    isPremium,
  } = offer;

  const offerPath = generatePath(AppRoute.Offer, {id});

  return (
    <article className="near-places__card place-card">
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}

      <div className="near-places__image-wrapper place-card__image-wrapper">
        <Link to={offerPath}>
          <img
            className="place-card__image"
            src={previewImage}
            width="260"
            height="200"
            alt="Place image"
          />
        </Link>
      </div>

      <div className="place-card__info">
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{price}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>

          <button
            className={classNames(
              'place-card__bookmark-button',
              'button',
              {'place-card__bookmark-button--active': isFavorite,}
            )}
            type="button"
          >
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>

            <span className="visually-hidden">
              {isFavorite ? 'In bookmarks' : 'To bookmarks'}
            </span>
          </button>
        </div>

        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span
              style={{
                width: `${rating * STAR_WIDTH_PERCENT}%`,
              }}
            >
            </span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>

        <h2 className="place-card__name">
          <Link to={offerPath}>
            {title}
          </Link>
        </h2>

        <p className="place-card__type">
          {type}
        </p>
      </div>
    </article>
  );
}

export default NearbyOffer;

import classNames from 'classnames';
import { memo } from 'react';
import { OfferDetails } from '../../types/offer';
import { SINGULAR_AMOUNT, STAR_WIDTH_PERCENT } from '../../const';
import OfferFavoriteButton from './offer-favorite-button';
import { ReviewsSection } from '../reviews';
import { capitalizeFirstLetter } from '../../utils/common';

type OfferInfoProps = {
  offer: OfferDetails ;
};

function OfferInfo({offer}: OfferInfoProps) {
  const {
    id,
    title,
    type,
    price,
    rating,
    isPremium,
    description,
    bedrooms,
    goods,
    host,
    maxAdults,
  } = offer;

  const bedroomsText = bedrooms === SINGULAR_AMOUNT ? 'Bedroom' : 'Bedrooms';
  const adultsText = maxAdults === SINGULAR_AMOUNT ? 'adult' : 'adults';

  return (
    <div className="offer__container container">
      <div className="offer__wrapper">
        {isPremium && (
          <div className="offer__mark">
            <span>Premium</span>
          </div>
        )}

        <div className="offer__name-wrapper">
          <h1 className="offer__name">
            {title}
          </h1>

          <OfferFavoriteButton offerId={id} />
        </div>

        <div className="offer__rating rating">
          <div className="offer__stars rating__stars">
            <span style={{
              width: `${Math.round(rating) * STAR_WIDTH_PERCENT}%`,
            }}
            />
            <span className="visually-hidden">Rating</span>
          </div>
          <span className="offer__rating-value rating__value">
            {rating}
          </span>
        </div>

        <ul className="offer__features">
          <li className="offer__feature offer__feature--entire">
            {capitalizeFirstLetter(type)}
          </li>
          <li className="offer__feature offer__feature--bedrooms">
            {bedrooms} {bedroomsText}
          </li>
          <li className="offer__feature offer__feature--adults">
            Max {maxAdults} {adultsText}
          </li>
        </ul>

        <div className="offer__price">
          <b className="offer__price-value">
            &euro;{price}
          </b>
          <span className="offer__price-text">
            &nbsp;night
          </span>
        </div>

        <div className="offer__inside">
          <h2 className="offer__inside-title">
            What&apos;s inside
          </h2>
          <ul className="offer__inside-list">
            {goods.map((good) => (
              <li className="offer__inside-item" key={good}>
                {good}
              </li>
            ))}
          </ul>
        </div>

        <div className="offer__host">
          <h2 className="offer__host-title">
            Meet the host
          </h2>

          <div className="offer__host-user user">
            <div
              className={classNames(
                'offer__avatar-wrapper',
                'user__avatar-wrapper',
                {
                  'offer__avatar-wrapper--pro': host.isPro,
                }
              )}
            >
              <img
                className="offer__avatar user__avatar"
                src={host.avatarUrl}
                width="74"
                height="74"
                alt="Host avatar"
              />
            </div>

            <span className="offer__user-name">
              {host.name}
            </span>

            {host.isPro && (
              <span className="offer__user-status">
                Pro
              </span>
            )}
          </div>

          <div className="offer__description">
            <p className="offer__text">
              {description}
            </p>
          </div>
        </div>
        <ReviewsSection offerId={id} />
      </div>
    </div>
  );
}

const MemoizedOfferInfo = memo(OfferInfo);

export default MemoizedOfferInfo;

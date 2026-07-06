import { memo } from 'react';
import { generatePath, Link } from 'react-router-dom';
import { AppRoute, STAR_WIDTH_PERCENT } from '../../const';
import { Offer } from '../../types/offer';
import CardFavoriteButton from './card-favorite-button';

type OfferCardProps = {
  offer: Offer;
  onMouseEnter: (offerId: string) => void;
  onMouseLeave: () => void;
};

function OfferCard({
  offer,
  onMouseEnter,
  onMouseLeave,
}: OfferCardProps) {
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
    <article
      className="cities__card place-card"
      onMouseEnter={() => onMouseEnter(id)}
      onMouseLeave={onMouseLeave}
    >
      {isPremium && (
        <div className="place-card__mark">
          <span>Premium</span>
        </div>
      )}
      <div className="cities__image-wrapper place-card__image-wrapper">
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
          <CardFavoriteButton
            offerId={id}
            isFavorite={isFavorite}
          />
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${rating * STAR_WIDTH_PERCENT}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={offerPath}>{title}</Link>
        </h2>
        <p className="place-card__type">{type}</p>
      </div>
    </article>
  );
}

const MemoizedOfferCard = memo(OfferCard);

export default MemoizedOfferCard;

import classNames from 'classnames';
import { useFavoriteButtonClick } from '../../hooks/use-favorite-button-click';

type CardFavoriteButtonProps = {
  offerId: string;
  isFavorite: boolean;
};

function CardFavoriteButton({
  offerId,
  isFavorite,
}: CardFavoriteButtonProps) {
  const handleFavoriteButtonClick = useFavoriteButtonClick(offerId, isFavorite);

  return (
    <button
      className={classNames(
        'place-card__bookmark-button',
        'button',
        {'place-card__bookmark-button--active': isFavorite}
      )}
      type="button"
      onClick={handleFavoriteButtonClick}
    >
      <svg className="place-card__bookmark-icon" width="18" height="19">
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">
        {isFavorite ? 'In bookmarks' : 'To bookmarks'}
      </span>
    </button>
  );
}

export default CardFavoriteButton;

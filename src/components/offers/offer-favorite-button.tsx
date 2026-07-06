import { memo } from 'react';
import classNames from 'classnames';
import { useAppSelector } from '../../hooks';
import { useFavoriteButtonClick } from '../../hooks/use-favorite-button-click';
import { selectCurrentOfferIsFavorite } from '../../store/offers';

type OfferFavoriteButtonProps = {
  offerId: string;
};

function OfferFavoriteButton({
  offerId,
}: OfferFavoriteButtonProps) {
  const isFavorite = useAppSelector(selectCurrentOfferIsFavorite);

  const handleFavoriteButtonClick = useFavoriteButtonClick(offerId, isFavorite);

  return (
    <button
      className={classNames(
        'offer__bookmark-button',
        'button',
        {'offer__bookmark-button--active': isFavorite}
      )}
      type="button"
      onClick={handleFavoriteButtonClick}
    >
      <svg className="offer__bookmark-icon" width="31" height="33">
        <use xlinkHref="#icon-bookmark" />
      </svg>
      <span className="visually-hidden">
        {isFavorite ? 'In bookmarks' : 'To bookmarks'}
      </span>
    </button>
  );
}

const MemoizedOfferFavoriteButton = memo(OfferFavoriteButton);

export default MemoizedOfferFavoriteButton;

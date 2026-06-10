import { Offer } from '../../types/offer';
import OfferCard from '../offer-card/offer-card';

type OffersListProps = {
  offers: Offer[];
  onCardMouseEnter: (offerId: string) => void;
  onCardMouseLeave: () => void;
};

function OffersList({
  offers,
  onCardMouseEnter,
  onCardMouseLeave,
}: OffersListProps) {
  return (
    <div className='cities__places-list places__list tabs__content'>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onMouseEnter={onCardMouseEnter}
          onMouseLeave={onCardMouseLeave}
        />
      ))}
    </div>
  );
}

export default OffersList;

import { Offer } from '../../types/offer';
import NearbyOffer from '../nearby-offer/nearby-offer';

type NearbyOffersListProps = {
  offers: Offer[];
};

function NearbyOffersList({offers}: NearbyOffersListProps) {
  return (
    <div className="near-places__list places__list">
      {offers.map((offer) => (
        <NearbyOffer
          key={offer.id}
          offer={offer}
        />
      ))}
    </div>
  );
}

export default NearbyOffersList;

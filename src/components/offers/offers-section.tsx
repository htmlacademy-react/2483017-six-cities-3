import { useMemo, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { SortOption } from '../../const';
import { getSortedOffers } from '../../utils';
import { useActiveOffer } from '../../hooks/use-active-offer';
import SortingOptions from '../sorting-options/sorting-options';
import OffersList from '../offers/offer-list';
import Map from '../map/map';
import { selectCurrentCityOffers } from '../../store/offers';
import { selectCity } from '../../store/app-process';

function OffersSection() {
  const cityName = useAppSelector(selectCity);
  const currentCityOffers = useAppSelector(selectCurrentCityOffers);

  const selectedCity = currentCityOffers[0]?.city;

  const [activeSortOption, setActiveSortOption] = useState(SortOption.Popular);
  const [activeOfferId, handleCardMouseEnter, handleCardMouseLeave] = useActiveOffer();

  const sortedOffers = useMemo(
    () => getSortedOffers(currentCityOffers, activeSortOption),
    [currentCityOffers, activeSortOption]
  );

  const selectedOffer = useMemo(
    () => sortedOffers.find((offer) => offer.id === activeOfferId),
    [sortedOffers, activeOfferId]
  );

  return (
    <div className="cities">
      <div className="cities__places-container container">
        <section className="cities__places places">
          <h2 className="visually-hidden">Places</h2>

          <b className="places__found">
            {currentCityOffers.length} places to stay in {cityName}
          </b>

          <SortingOptions
            activeSortOption={activeSortOption}
            onSortOptionChange={setActiveSortOption}
          />

          <OffersList
            offers={sortedOffers}
            onCardMouseEnter={handleCardMouseEnter}
            onCardMouseLeave={handleCardMouseLeave}
          />
        </section>

        <div className="cities__right-section">
          <Map
            city={selectedCity}
            offers={sortedOffers}
            selectedOffer={selectedOffer}
          />
        </div>
      </div>
    </div>
  );
}

export default OffersSection;

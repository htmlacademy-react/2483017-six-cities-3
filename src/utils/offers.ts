import { SortOption } from '../const';
import { Offer } from '../types/offer';

export const getSortedOffers = (
  offers: Offer[],
  sortOption: SortOption
) => {
  switch (sortOption) {
    case SortOption.PriceLowToHigh:
      return [...offers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);

    case SortOption.PriceHighToLow:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.price - firstOffer.price);

    case SortOption.TopRatedFirst:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.rating - firstOffer.rating);

    case SortOption.Popular:
      return [...offers];
  }
};

export function getFavoriteOffersByCity(offers: Offer[]) {
  return offers.reduce<Record<string, Offer[]>>((favoriteOffersByCity, offer) => {
    const cityName = offer.city.name;

    if (!favoriteOffersByCity[cityName]) {
      favoriteOffersByCity[cityName] = [];
    }

    favoriteOffersByCity[cityName].push(offer);

    return favoriteOffersByCity;
  }, {});
}

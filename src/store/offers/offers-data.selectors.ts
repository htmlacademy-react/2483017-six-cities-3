import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { selectCity } from '../app-process';

export const selectOffers = (state: State) =>
  state[NameSpace.Offers].offers;

export const selectOffersLoadingStatus = (state: State) =>
  state[NameSpace.Offers].isOffersLoading;

export const selectCurrentCityOffers = createSelector(
  [selectOffers, selectCity],
  (offers, city) => offers.filter((offer) => offer.city.name === city)
);

export const selectFavoriteOffers = (state: State) =>
  state[NameSpace.Offers].favoriteOffers;

export const selectFavoriteOffersCount = createSelector(
  [selectFavoriteOffers],
  (favoriteOffers) => favoriteOffers.length
);

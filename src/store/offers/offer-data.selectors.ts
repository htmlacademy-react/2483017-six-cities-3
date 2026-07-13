import { createSelector } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const selectCurrentOffer = (state: State) =>
  state[NameSpace.Offer].currentOffer;

export const selectNearbyOffers = (state: State) =>
  state[NameSpace.Offer].nearbyOffers;

export const selectReviews = (state: State) =>
  state[NameSpace.Offer].reviews;

export const selectOfferLoadingStatus = (state: State) =>
  state[NameSpace.Offer].isOfferLoading;

export const selectOfferNotFoundStatus = (state: State) =>
  state[NameSpace.Offer].isOfferNotFound;

export const selectCurrentOfferIsFavorite = createSelector(
  [selectCurrentOffer],
  (currentOffer) => currentOffer?.isFavorite ?? false
);

export const selectOfferLoadingErrorStatus = (state: State) =>
  state[NameSpace.Offer].isOfferLoadingError;

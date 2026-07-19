import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Offer } from '../../types/offer';
import {
  fetchOffersAction,
  changeFavoriteStatusAction,
  fetchFavoriteOffersAction,
} from '../api-actions';

type OffersData = {
  offers: Offer[];
  favoriteOffers: Offer[];
  isOffersLoading: boolean;
  isOffersLoadingError: boolean;
  isFavoriteOffersLoadingError: boolean;
};

const initialState: OffersData = {
  offers: [],
  favoriteOffers: [],
  isOffersLoading: false,
  isOffersLoadingError: false,
  isFavoriteOffersLoadingError: false,
};

export const offersData = createSlice({
  name: NameSpace.Offers,
  initialState,
  reducers: {
    resetOffersFavoriteStatus: (state) => {
      state.offers = state.offers.map((offer) => ({
        ...offer,
        isFavorite: false,
      }));

      state.favoriteOffers = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersLoading = true;
        state.isOffersLoadingError = false;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
        state.isOffersLoadingError = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersLoading = false;
        state.isOffersLoadingError = true;
      })
      .addCase(fetchFavoriteOffersAction.pending, (state) => {
        state.isFavoriteOffersLoadingError = false;
      })
      .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
        state.isFavoriteOffersLoadingError = false;
      })
      .addCase(fetchFavoriteOffersAction.rejected, (state) => {
        state.isFavoriteOffersLoadingError = true;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        state.offers = state.offers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );

        if (updatedOffer.isFavorite) {
          const isAlreadyFavorite = state.favoriteOffers.some(
            (offer) => offer.id === updatedOffer.id
          );

          if (!isAlreadyFavorite) {
            state.favoriteOffers.push(updatedOffer);
          }
        } else {
          state.favoriteOffers = state.favoriteOffers.filter(
            (offer) => offer.id !== updatedOffer.id
          );
        }
      });
  },
});

export const { resetOffersFavoriteStatus } = offersData.actions;

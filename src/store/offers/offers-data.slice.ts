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
};

const initialState: OffersData = {
  offers: [],
  favoriteOffers: [],
  isOffersLoading: false,
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
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOffersAction.pending, (state) => {
        state.isOffersLoading = true;
      })
      .addCase(fetchOffersAction.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersLoading = false;
      })
      .addCase(fetchOffersAction.rejected, (state) => {
        state.isOffersLoading = false;
      })
      .addCase(fetchFavoriteOffersAction.fulfilled, (state, action) => {
        state.favoriteOffers = action.payload;
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        state.offers = state.offers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );
      });
  },
});

export const { resetOffersFavoriteStatus } = offersData.actions;

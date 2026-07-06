import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { Offer, OfferDetails } from '../../types/offer';
import { Review } from '../../types/review';
import {
  changeFavoriteStatusAction,
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
  sendReviewAction,
} from '../api-actions';

type OfferData = {
  currentOffer: OfferDetails | null;
  nearbyOffers: Offer[];
  reviews: Review[];
  isOfferLoading: boolean;
  isOfferNotFound: boolean;
};

const initialState: OfferData = {
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  isOfferNotFound: false,
};

export const offerData = createSlice({
  name: NameSpace.Offer,
  initialState,
  reducers: {
    resetOfferData: () => initialState,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOfferAction.pending, (state) => {
        state.isOfferLoading = true;
        state.isOfferNotFound = false;
      })
      .addCase(fetchOfferAction.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.isOfferLoading = false;
        state.isOfferNotFound = false;
      })
      .addCase(fetchOfferAction.rejected, (state) => {
        state.currentOffer = null;
        state.isOfferLoading = false;
        state.isOfferNotFound = true;
      })
      .addCase(fetchNearbyOffersAction.fulfilled, (state, action) => {
        state.nearbyOffers = action.payload;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
      })
      .addCase(sendReviewAction.fulfilled, (state, action) => {
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(changeFavoriteStatusAction.fulfilled, (state, action) => {
        const updatedOffer = action.payload;

        state.nearbyOffers = state.nearbyOffers.map((offer) =>
          offer.id === updatedOffer.id ? updatedOffer : offer
        );

        if (state.currentOffer?.id === updatedOffer.id) {
          state.currentOffer = {
            ...state.currentOffer,
            isFavorite: updatedOffer.isFavorite,
          };
        }
      });
  },
});

export const { resetOfferData } = offerData.actions;

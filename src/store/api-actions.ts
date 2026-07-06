import { AxiosInstance } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute } from '../const';
import { Offer, OfferDetails } from '../types/offer';
import { Review, ReviewPost } from '../types/review';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { saveToken, dropToken } from '../services/token';

type Extra = {
  extra: AxiosInstance;
};

export const fetchOffersAction = createAsyncThunk<Offer[], undefined, Extra>(
  'offers/fetchOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Offers);

    return data;
  },
);

export const fetchOfferAction = createAsyncThunk<OfferDetails, string, Extra>(
  'offer/fetchOffer',
  async (offerId, {extra: api}) => {
    const { data } = await api.get<OfferDetails>(
      `${APIRoute.Offers}/${offerId}`
    );

    return data;
  },
);

export const fetchNearbyOffersAction = createAsyncThunk<Offer[], string, Extra>(
  'offer/fetchNearbyOffers',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Offer[]>(
      `${APIRoute.Offers}/${offerId}/nearby`
    );

    return data;
  },
);

export const fetchReviewsAction = createAsyncThunk<Review[], string, Extra>(
  'offer/fetchReviews',
  async (offerId, { extra: api }) => {
    const { data } = await api.get<Review[]>(
      `${APIRoute.Comments}/${offerId}`
    );

    return data;
  },
);

export const sendReviewAction = createAsyncThunk<Review, ReviewPost, Extra>(
  'offer/sendReview',
  async ({ offerId, comment, rating }, { extra: api }) => {
    const { data } = await api.post<Review>(
      `${APIRoute.Comments}/${offerId}`,
      { comment, rating }
    );

    return data;
  },
);

export const changeFavoriteStatusAction = createAsyncThunk<
  Offer,
  { offerId: string; status: number },
  Extra
>(
  'offers/changeFavoriteStatus',
  async ({ offerId, status }, { extra: api }) => {
    const { data } = await api.post<Offer>(
      `${APIRoute.Favorite}/${offerId}/${status}`
    );

    return data;
  },
);

export const checkAuthAction = createAsyncThunk<UserData, undefined, Extra>(
  'user/checkAuth',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<UserData>(APIRoute.Login);

    return data;
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, Extra>(
  'user/login',
  async ({ email, password }, { extra: api }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });

    saveToken(data.token);

    return data;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, Extra>(
  'user/logout',
  async (_arg, { extra: api }) => {
    await api.delete(APIRoute.Logout);

    dropToken();
  },
);

import axios, {AxiosInstance} from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { APIRoute, FavoriteStatus, UNKNOWN_ERROR_STATUS } from '../const';
import { Offer, OfferDetails } from '../types/offer';
import { Review, ReviewPost } from '../types/review';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { saveToken, dropToken } from '../services/token';
import { resetOffersFavoriteStatus } from './offers';

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

export const fetchOfferAction = createAsyncThunk<
  OfferDetails,
  string,
  Extra & {
    rejectValue: number;
  }
>(
  'offer/fetchOffer',
  async (offerId, {extra: api, rejectWithValue}) => {
    try {
      const {data} = await api.get<OfferDetails>(
        `${APIRoute.Offers}/${offerId}`,
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.status);
      }

      return rejectWithValue(UNKNOWN_ERROR_STATUS);
    }
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

export const fetchFavoriteOffersAction = createAsyncThunk<Offer[], undefined, Extra>(
  'offers/fetchFavoriteOffers',
  async (_arg, { extra: api }) => {
    const { data } = await api.get<Offer[]>(APIRoute.Favorite);

    return data;
  },
);

export const changeFavoriteStatusAction = createAsyncThunk<
  Offer,
  { offerId: string; status: FavoriteStatus },
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

export const checkAuthAction = createAsyncThunk<
  UserData,
  undefined,
  Extra & {
    rejectValue: number;
  }
>(
  'user/checkAuth',
  async (_arg, {extra: api, dispatch, rejectWithValue}) => {
    try {
      const {data} = await api.get<UserData>(APIRoute.Login);

      dispatch(fetchFavoriteOffersAction());

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.status);
      }

      return rejectWithValue(UNKNOWN_ERROR_STATUS);
    }
  },
);

export const loginAction = createAsyncThunk<UserData, AuthData, Extra>(
  'user/login',
  async ({ email, password }, { extra: api, dispatch }) => {
    const { data } = await api.post<UserData>(APIRoute.Login, { email, password });

    saveToken(data.token);

    dispatch(fetchOffersAction());
    dispatch(fetchFavoriteOffersAction());

    return data;
  },
);

export const logoutAction = createAsyncThunk<void, undefined, Extra>(
  'user/logout',
  async (_arg, { extra: api, dispatch }) => {
    try {
      await api.delete(APIRoute.Logout);
    } finally {
      dropToken();

      dispatch(resetOffersFavoriteStatus());
    }
  },
);

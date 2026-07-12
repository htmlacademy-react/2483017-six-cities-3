import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { City, Offer, OfferDetails } from '../types/offer';
import { Review } from '../types/review';
import { UserData } from '../types/user-data';
import { createAPI } from '../services/api';
import { State } from '../types/state';
import { AuthorizationStatus, CITIES, NameSpace } from '../const';
import { AuthData } from '../types/auth-data';

export const makeFakeCity = (): City => ({
  name: 'Paris',
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 13,
  },
});

export const makeFakeOffer = (id = '1'): Offer => ({
  id,
  title: `Beautiful offer ${id}`,
  type: 'apartment',
  price: 120,
  city: makeFakeCity(),
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 16,
  },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  previewImage: 'img/apartment-01.jpg',
});

export const makeFakeOfferDetails = (id = '1'): OfferDetails => ({
  ...makeFakeOffer(id),
  description: `Description for offer ${id}`,
  bedrooms: 2,
  goods: ['Heating', 'Kitchen', 'Wi-Fi'],
  host: {
    name: 'Angelina',
    avatarUrl: 'img/avatar-angelina.jpg',
    isPro: true,
  },
  images: [
    'img/apartment-01.jpg',
    'img/apartment-02.jpg',
  ],
  maxAdults: 3,
});

export const makeFakeReview = (id = '1'): Review => ({
  id,
  date: '2024-01-01T00:00:00.000Z',
  user: {
    name: 'Max',
    avatarUrl: 'img/avatar-max.jpg',
    isPro: false,
  },
  comment: `Review comment ${id}`,
  rating: 4,
});

export const makeFakeUserData = (): UserData => ({
  id: 1,
  email: 'test@test.com',
  token: 'secret-token',
});

export const makeFakeAuthData = (): AuthData => ({
  email: 'test@test.com',
  password: '123456',
});

export const extractActionsTypes = (actions: Action<string>[]) =>
  actions.map(({ type }) => type);

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createAPI>, Action>;

type PartialState = {
  [Key in keyof State]?: Partial<State[Key]>;
};

export const makeFakeStore = (initialState?: PartialState): State => ({
  [NameSpace.App]: {
    city: CITIES[0],
    ...initialState?.[NameSpace.App],
  },
  [NameSpace.User]: {
    authorizationStatus: AuthorizationStatus.NoAuth,
    userEmail: '',
    ...initialState?.[NameSpace.User],
  },
  [NameSpace.Offers]: {
    offers: [],
    favoriteOffers: [],
    isOffersLoading: false,
    ...initialState?.[NameSpace.Offers],
  },
  [NameSpace.Offer]: {
    currentOffer: null,
    nearbyOffers: [],
    reviews: [],
    isOfferLoading: false,
    isOfferNotFound: false,
    ...initialState?.[NameSpace.Offer],
  },
});

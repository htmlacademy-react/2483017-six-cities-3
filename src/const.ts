export enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
  NotFound = '/404',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
  Error = 'ERROR',
}

export enum APIRoute {
  Offers = '/offers',
  Login = '/login',
  Logout = '/logout',
  Comments = '/comments',
  Favorite = '/favorite',
}

export const STAR_WIDTH_PERCENT = 20;

export const MarkerUrl = {
  Default: '/img/pin.svg',
  Current: '/img/pin-active.svg',
} as const;

export const Limits = {
  OfferImages: 6,
  NearbyOffers: 3,
  Reviews: 10,
} as const;

export const ReviewLength = {
  Min: 50,
  Max: 300,
} as const;

export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

export enum SortOption {
  Popular = 'Popular',
  PriceLowToHigh = 'Price: low to high',
  PriceHighToLow = 'Price: high to low',
  TopRatedFirst = 'Top rated first',
}

export const SORT_OPTIONS = [
  SortOption.Popular,
  SortOption.PriceLowToHigh,
  SortOption.PriceHighToLow,
  SortOption.TopRatedFirst,
];

export const BACKEND_URL = 'https://15.design.htmlacademy.pro/six-cities';

export const REQUEST_TIMEOUT = 5000;

export const SINGULAR_AMOUNT = 1;

export enum NameSpace {
  App = 'APP',
  User = 'USER',
  Offers = 'OFFERS',
  Offer = 'OFFER',
}

export enum FavoriteStatus {
  Removed = 0,
  Added = 1,
}

export const UNKNOWN_ERROR_STATUS = 0;

export const RATING_OPTIONS = [
  { value: '5', title: 'perfect', id: '5-stars' },
  { value: '4', title: 'good', id: '4-stars' },
  { value: '3', title: 'not bad', id: '3-stars' },
  { value: '2', title: 'badly', id: '2-stars' },
  { value: '1', title: 'terribly', id: '1-stars' },
] as const;

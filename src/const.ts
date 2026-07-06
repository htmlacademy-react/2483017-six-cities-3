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
}

export enum APIRoute {
  Offers = '/offers',
  Login = '/login',
  Logout = '/logout',
  Comments = '/comments',
  Favorite = '/favorite',
}

export const STAR_WIDTH_PERCENT = 20;

export const URL_MARKER_DEFAULT = '/img/pin.svg';

export const URL_MARKER_CURRENT = '/img/pin-active.svg';

export const NEARBY_OFFERS_LIMIT = 3;

export const OFFER_IMAGES_LIMIT = 6;

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

export const MIN_REVIEW_LENGTH = 50;

export const MAX_REVIEW_LENGTH = 300;

export const REVIEWS_LIMIT = 10;

export const SINGULAR_AMOUNT = 1;

export enum NameSpace {
  App = 'APP',
  User = 'USER',
  Offers = 'OFFERS',
  Offer = 'OFFER',
}

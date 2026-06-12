export enum AppRoute {
  Main = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer/:id',
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export const STAR_WIDTH_PERCENT = 20;

export const URL_MARKER_DEFAULT = '/img/pin.svg';

export const URL_MARKER_CURRENT = '/img/pin-active.svg';

export const NEARBY_OFFERS_LIMIT = 3;

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

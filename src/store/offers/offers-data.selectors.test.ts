import { CITIES, NameSpace } from '../../const';
import {
  makeFakeOffer,
  makeFakeStore,
} from '../../utils/mocks';
import {
  selectCurrentCityOffers,
  selectFavoriteOffers,
  selectFavoriteOffersCount,
  selectOffers,
  selectOffersLoadingStatus,
} from './offers-data.selectors';

describe('Offers data selectors', () => {
  it('should return offers from state', () => {
    const offers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const state = makeFakeStore({
      [NameSpace.Offers]: {
        offers,
      },
    });

    expect(selectOffers(state)).toBe(offers);
  });

  it('should return favorite offers from state', () => {
    const favoriteOffers = [
      {
        ...makeFakeOffer('1'),
        isFavorite: true,
      },
      {
        ...makeFakeOffer('2'),
        isFavorite: true,
      },
    ];

    const state = makeFakeStore({
      [NameSpace.Offers]: {
        favoriteOffers,
      },
    });

    expect(selectFavoriteOffers(state)).toBe(
      favoriteOffers,
    );
  });

  it('should return favorite offers count', () => {
    const favoriteOffers = [
      {
        ...makeFakeOffer('1'),
        isFavorite: true,
      },
      {
        ...makeFakeOffer('2'),
        isFavorite: true,
      },
    ];

    const state = makeFakeStore({
      [NameSpace.Offers]: {
        favoriteOffers,
      },
    });

    expect(
      selectFavoriteOffersCount(state),
    ).toBe(favoriteOffers.length);
  });

  it('should return zero when favorite offers list is empty', () => {
    const state = makeFakeStore({
      [NameSpace.Offers]: {
        favoriteOffers: [],
      },
    });

    expect(
      selectFavoriteOffersCount(state),
    ).toBe(0);
  });

  it('should return offers loading status from state', () => {
    const isOffersLoading = true;

    const state = makeFakeStore({
      [NameSpace.Offers]: {
        isOffersLoading,
      },
    });

    expect(
      selectOffersLoadingStatus(state),
    ).toBe(isOffersLoading);
  });

  it('should return offers for current city', () => {
    const currentCity = CITIES[0];
    const anotherCity = CITIES[1];

    const firstOffer = makeFakeOffer('1');
    const secondOffer = makeFakeOffer('2');

    const currentCityOffer = {
      ...firstOffer,
      city: {
        ...firstOffer.city,
        name: currentCity,
      },
    };

    const anotherCityOffer = {
      ...secondOffer,
      city: {
        ...secondOffer.city,
        name: anotherCity,
      },
    };

    const state = makeFakeStore({
      [NameSpace.App]: {
        city: currentCity,
      },
      [NameSpace.Offers]: {
        offers: [
          currentCityOffer,
          anotherCityOffer,
        ],
      },
    });

    expect(
      selectCurrentCityOffers(state),
    ).toEqual([currentCityOffer]);
  });

  it('should return empty array when current city has no offers', () => {
    const currentCity = CITIES[0];
    const anotherCity = CITIES[1];
    const offer = makeFakeOffer('1');

    const anotherCityOffer = {
      ...offer,
      city: {
        ...offer.city,
        name: anotherCity,
      },
    };

    const state = makeFakeStore({
      [NameSpace.App]: {
        city: currentCity,
      },
      [NameSpace.Offers]: {
        offers: [anotherCityOffer],
      },
    });

    expect(
      selectCurrentCityOffers(state),
    ).toEqual([]);
  });
});

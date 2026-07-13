import {
  changeFavoriteStatusAction,
  fetchFavoriteOffersAction,
  fetchOffersAction,
} from '../api-actions';
import { makeFakeOffer } from '../../utils/mocks';
import {
  offersData,
  resetOffersFavoriteStatus,
} from './offers-data.slice';

const makeInitialState = () => ({
  offers: [],
  favoriteOffers: [],
  isOffersLoading: false,
  isOffersLoadingError: false,
  isFavoriteOffersLoadingError: false,
});

describe('OffersData Slice', () => {
  it('should return initial state when passed empty action and undefined state', () => {
    const result = offersData.reducer(undefined, { type: '' });

    expect(result).toEqual(makeInitialState());
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      ...makeInitialState(),
      offers: [makeFakeOffer('1')],
      favoriteOffers: [makeFakeOffer('2')],
      isOffersLoading: true,
    };

    const result = offersData.reducer(currentState, { type: '' });

    expect(result).toEqual(currentState);
  });

  it('should start loading offers with fetchOffersAction.pending', () => {
    const initialState = {
      ...makeInitialState(),
      isOffersLoadingError: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.pending('', undefined),
    );

    expect(result).toEqual({
      ...initialState,
      isOffersLoading: true,
      isOffersLoadingError: false,
    });
  });

  it('should save offers with fetchOffersAction.fulfilled', () => {
    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const initialState = {
      ...makeInitialState(),
      isOffersLoading: true,
      isOffersLoadingError: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.fulfilled(mockOffers, '', undefined),
    );

    expect(result).toEqual({
      ...makeInitialState(),
      offers: mockOffers,
    });
  });

  it('should save offers loading error with fetchOffersAction.rejected', () => {
    const initialState = {
      ...makeInitialState(),
      isOffersLoading: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.rejected(null, '', undefined),
    );

    expect(result).toEqual({
      ...initialState,
      isOffersLoading: false,
      isOffersLoadingError: true,
    });
  });

  it('should clear favorite loading error with fetchFavoriteOffersAction.pending', () => {
    const initialState = {
      ...makeInitialState(),
      isFavoriteOffersLoadingError: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchFavoriteOffersAction.pending('', undefined),
    );

    expect(result.isFavoriteOffersLoadingError).toBe(false);
  });

  it('should save favorite offers with fetchFavoriteOffersAction.fulfilled', () => {
    const mockFavoriteOffers = [
      {
        ...makeFakeOffer('1'),
        isFavorite: true,
      },
      {
        ...makeFakeOffer('2'),
        isFavorite: true,
      },
    ];

    const initialState = {
      ...makeInitialState(),
      isFavoriteOffersLoadingError: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchFavoriteOffersAction.fulfilled(
        mockFavoriteOffers,
        '',
        undefined,
      ),
    );

    expect(result).toEqual({
      ...makeInitialState(),
      favoriteOffers: mockFavoriteOffers,
    });
  });

  it('should save favorite loading error with fetchFavoriteOffersAction.rejected', () => {
    const result = offersData.reducer(
      makeInitialState(),
      fetchFavoriteOffersAction.rejected(null, '', undefined),
    );

    expect(result.isFavoriteOffersLoadingError).toBe(true);
  });

  it('should update an offer in offers and add it to favoriteOffers', () => {
    const firstOffer = makeFakeOffer('1');
    const secondOffer = makeFakeOffer('2');

    const updatedOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const initialState = {
      ...makeInitialState(),
      offers: [
        firstOffer,
        secondOffer,
      ],
    };

    const result = offersData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      }),
    );

    expect(result.offers).toEqual([
      updatedOffer,
      secondOffer,
    ]);

    expect(result.favoriteOffers).toEqual([
      updatedOffer,
    ]);
  });

  it('should not duplicate an offer already present in favoriteOffers', () => {
    const favoriteOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const updatedOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
      price: 999,
    };

    const initialState = {
      ...makeInitialState(),
      offers: [makeFakeOffer('1')],
      favoriteOffers: [favoriteOffer],
    };

    const result = offersData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      }),
    );

    expect(result.favoriteOffers).toHaveLength(1);
  });

  it('should remove an offer from favoriteOffers when it is no longer favorite', () => {
    const favoriteOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const updatedOffer = {
      ...makeFakeOffer('1'),
      isFavorite: false,
    };

    const initialState = {
      ...makeInitialState(),
      offers: [favoriteOffer],
      favoriteOffers: [favoriteOffer],
    };

    const result = offersData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 0,
      }),
    );

    expect(result.offers).toEqual([
      updatedOffer,
    ]);

    expect(result.favoriteOffers).toEqual([]);
  });

  it('should reset favorite status for all offers', () => {
    const firstOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const secondOffer = {
      ...makeFakeOffer('2'),
      isFavorite: true,
    };

    const initialState = {
      ...makeInitialState(),
      offers: [
        firstOffer,
        secondOffer,
      ],
    };

    const result = offersData.reducer(
      initialState,
      resetOffersFavoriteStatus(),
    );

    expect(result.offers).toEqual([
      {
        ...firstOffer,
        isFavorite: false,
      },
      {
        ...secondOffer,
        isFavorite: false,
      },
    ]);
  });
});

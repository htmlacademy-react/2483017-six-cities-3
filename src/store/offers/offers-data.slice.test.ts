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

describe('OffersData Slice', () => {
  it('should return initial state when passed empty action and undefined state', () => {
    const emptyAction = { type: '' };

    const expectedState = {
      offers: [],
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      offers: [makeFakeOffer('1')],
      favoriteOffers: [makeFakeOffer('2')],
      isOffersLoading: true,
    };

    const emptyAction = { type: '' };

    const result = offersData.reducer(currentState, emptyAction);

    expect(result).toEqual(currentState);
  });

  it('should set "isOffersLoading" to "true" with "fetchOffersAction.pending"', () => {
    const initialState = {
      offers: [],
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.pending('', undefined)
    );

    expect(result.isOffersLoading).toBe(true);
  });

  it('should set "offers" to array with offers and "isOffersLoading" to "false" with "fetchOffersAction.fulfilled"', () => {
    const mockOffers = [makeFakeOffer('1'), makeFakeOffer('2')];

    const initialState = {
      offers: [],
      favoriteOffers: [],
      isOffersLoading: true,
    };

    const expectedState = {
      offers: mockOffers,
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.fulfilled(mockOffers, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "isOffersLoading" to "false" with "fetchOffersAction.rejected"', () => {
    const initialState = {
      offers: [],
      favoriteOffers: [],
      isOffersLoading: true,
    };

    const result = offersData.reducer(
      initialState,
      fetchOffersAction.rejected(null, '', undefined)
    );

    expect(result.isOffersLoading).toBe(false);
  });

  it('should set "favoriteOffers" to array with favorite offers with "fetchFavoriteOffersAction.fulfilled"', () => {
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
      offers: [],
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(
      initialState,
      fetchFavoriteOffersAction.fulfilled(mockFavoriteOffers, '', undefined)
    );

    expect(result.favoriteOffers).toEqual(mockFavoriteOffers);
  });

  it('should update offer in "offers" with "changeFavoriteStatusAction.fulfilled"', () => {
    const offer = makeFakeOffer('1');
    const anotherOffer = makeFakeOffer('2');

    const updatedOffer = {
      ...offer,
      isFavorite: true,
    };

    const initialState = {
      offers: [offer, anotherOffer],
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: offer.id,
        status: 1,
      })
    );

    expect(result.offers).toEqual([updatedOffer, anotherOffer]);
  });

  it('should reset favorite status for all offers with "resetOffersFavoriteStatus"', () => {
    const firstOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const secondOffer = {
      ...makeFakeOffer('2'),
      isFavorite: true,
    };

    const initialState = {
      offers: [firstOffer, secondOffer],
      favoriteOffers: [],
      isOffersLoading: false,
    };

    const result = offersData.reducer(
      initialState,
      resetOffersFavoriteStatus()
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

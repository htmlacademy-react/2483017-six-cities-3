import {
  changeFavoriteStatusAction,
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
  sendReviewAction,
} from '../api-actions';
import {
  makeFakeOffer,
  makeFakeOfferDetails,
  makeFakeReview,
} from '../../utils/mocks';
import { offerData, resetOfferData } from './offer-data.slice';

const makeInitialState = () => ({
  currentOffer: null,
  nearbyOffers: [],
  reviews: [],
  isOfferLoading: false,
  isOfferNotFound: false,
  isOfferLoadingError: false,
});

describe('OfferData Slice', () => {
  it('should return initial state when passed empty action and undefined state', () => {
    const result = offerData.reducer(undefined, { type: '' });

    expect(result).toEqual(makeInitialState());
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      ...makeInitialState(),
      currentOffer: makeFakeOfferDetails('1'),
      nearbyOffers: [makeFakeOffer('2')],
      reviews: [makeFakeReview('1')],
      isOfferLoading: true,
    };

    const result = offerData.reducer(currentState, { type: '' });

    expect(result).toEqual(currentState);
  });

  it('should reset offer data with resetOfferData', () => {
    const initialState = {
      ...makeInitialState(),
      currentOffer: makeFakeOfferDetails('1'),
      nearbyOffers: [makeFakeOffer('2')],
      reviews: [makeFakeReview('1')],
      isOfferLoading: true,
      isOfferNotFound: true,
      isOfferLoadingError: true,
    };

    const result = offerData.reducer(initialState, resetOfferData());

    expect(result).toEqual(makeInitialState());
  });

  it('should start loading offer with fetchOfferAction.pending', () => {
    const initialState = {
      ...makeInitialState(),
      isOfferNotFound: true,
      isOfferLoadingError: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.pending('', '1'),
    );

    expect(result).toEqual({
      ...initialState,
      isOfferLoading: true,
      isOfferNotFound: false,
      isOfferLoadingError: false,
    });
  });

  it('should save offer with fetchOfferAction.fulfilled', () => {
    const mockOffer = makeFakeOfferDetails('1');

    const initialState = {
      ...makeInitialState(),
      isOfferLoading: true,
      isOfferNotFound: true,
      isOfferLoadingError: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.fulfilled(mockOffer, '', mockOffer.id),
    );

    expect(result).toEqual({
      ...makeInitialState(),
      currentOffer: mockOffer,
    });
  });

  it('should mark offer as not found when fetchOfferAction is rejected with 404', () => {
    const initialState = {
      ...makeInitialState(),
      currentOffer: makeFakeOfferDetails('1'),
      isOfferLoading: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.rejected(null, '', '1', 404),
    );

    expect(result).toEqual({
      ...makeInitialState(),
      isOfferNotFound: true,
    });
  });

  it('should mark loading error when fetchOfferAction fails without 404', () => {
    const initialState = {
      ...makeInitialState(),
      currentOffer: makeFakeOfferDetails('1'),
      isOfferLoading: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.rejected(null, '', '1', 0),
    );

    expect(result).toEqual({
      ...makeInitialState(),
      isOfferLoadingError: true,
    });
  });

  it('should save nearby offers with fetchNearbyOffersAction.fulfilled', () => {
    const mockNearbyOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const result = offerData.reducer(
      makeInitialState(),
      fetchNearbyOffersAction.fulfilled(mockNearbyOffers, '', '1'),
    );

    expect(result.nearbyOffers).toEqual(mockNearbyOffers);
  });

  it('should save reviews with fetchReviewsAction.fulfilled', () => {
    const mockReviews = [
      makeFakeReview('1'),
      makeFakeReview('2'),
    ];

    const result = offerData.reducer(
      makeInitialState(),
      fetchReviewsAction.fulfilled(mockReviews, '', '1'),
    );

    expect(result.reviews).toEqual(mockReviews);
  });

  it('should add a new review to the beginning with sendReviewAction.fulfilled', () => {
    const oldReview = makeFakeReview('1');
    const newReview = makeFakeReview('2');

    const initialState = {
      ...makeInitialState(),
      reviews: [oldReview],
    };

    const result = offerData.reducer(
      initialState,
      sendReviewAction.fulfilled(newReview, '', {
        offerId: '1',
        comment: newReview.comment,
        rating: newReview.rating,
      }),
    );

    expect(result.reviews).toEqual([
      newReview,
      oldReview,
    ]);
  });

  it('should update an offer in nearbyOffers with changeFavoriteStatusAction.fulfilled', () => {
    const firstOffer = makeFakeOffer('1');
    const secondOffer = makeFakeOffer('2');

    const updatedOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const initialState = {
      ...makeInitialState(),
      nearbyOffers: [
        firstOffer,
        secondOffer,
      ],
    };

    const result = offerData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      }),
    );

    expect(result.nearbyOffers).toEqual([
      updatedOffer,
      secondOffer,
    ]);
  });

  it('should update isFavorite in currentOffer with changeFavoriteStatusAction.fulfilled', () => {
    const currentOffer = makeFakeOfferDetails('1');

    const updatedOffer = {
      ...makeFakeOffer('1'),
      isFavorite: true,
    };

    const initialState = {
      ...makeInitialState(),
      currentOffer,
    };

    const result = offerData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: '1',
        status: 1,
      }),
    );

    expect(result.currentOffer).toEqual({
      ...currentOffer,
      isFavorite: true,
    });
  });
});

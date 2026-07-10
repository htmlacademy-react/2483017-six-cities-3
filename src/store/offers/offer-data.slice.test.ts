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

describe('OfferData Slice', () => {
  it('should return initial state when passed empty action and undefined state', () => {
    const emptyAction = { type: '' };

    const expectedState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      currentOffer: makeFakeOfferDetails('1'),
      nearbyOffers: [makeFakeOffer('2')],
      reviews: [makeFakeReview('1')],
      isOfferLoading: true,
      isOfferNotFound: false,
    };

    const emptyAction = { type: '' };

    const result = offerData.reducer(currentState, emptyAction);

    expect(result).toEqual(currentState);
  });

  it('should reset offer data with "resetOfferData"', () => {
    const initialState = {
      currentOffer: makeFakeOfferDetails('1'),
      nearbyOffers: [makeFakeOffer('2')],
      reviews: [makeFakeReview('1')],
      isOfferLoading: true,
      isOfferNotFound: true,
    };

    const expectedState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(initialState, resetOfferData());

    expect(result).toEqual(expectedState);
  });

  it('should set "isOfferLoading" to "true" and "isOfferNotFound" to "false" with "fetchOfferAction.pending"', () => {
    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.pending('', '1')
    );

    expect(result.isOfferLoading).toBe(true);
    expect(result.isOfferNotFound).toBe(false);
  });

  it('should set "currentOffer" to offer, "isOfferLoading" to "false" and "isOfferNotFound" to "false" with "fetchOfferAction.fulfilled"', () => {
    const mockOffer = makeFakeOfferDetails('1');

    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: true,
      isOfferNotFound: false,
    };

    const expectedState = {
      currentOffer: mockOffer,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.fulfilled(mockOffer, '', mockOffer.id)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "currentOffer" to "null", "isOfferLoading" to "false" and "isOfferNotFound" to "true" with "fetchOfferAction.rejected"', () => {
    const initialState = {
      currentOffer: makeFakeOfferDetails('1'),
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: true,
      isOfferNotFound: false,
    };

    const expectedState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: true,
    };

    const result = offerData.reducer(
      initialState,
      fetchOfferAction.rejected(null, '', '1')
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "nearbyOffers" to array with nearby offers with "fetchNearbyOffersAction.fulfilled"', () => {
    const mockNearbyOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      fetchNearbyOffersAction.fulfilled(mockNearbyOffers, '', '1')
    );

    expect(result.nearbyOffers).toEqual(mockNearbyOffers);
  });

  it('should set "reviews" to array with reviews with "fetchReviewsAction.fulfilled"', () => {
    const mockReviews = [
      makeFakeReview('1'),
      makeFakeReview('2'),
    ];

    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      fetchReviewsAction.fulfilled(mockReviews, '', '1')
    );

    expect(result.reviews).toEqual(mockReviews);
  });

  it('should add new review to the beginning of "reviews" with "sendReviewAction.fulfilled"', () => {
    const oldReview = makeFakeReview('1');
    const newReview = makeFakeReview('2');

    const reviewPost = {
      offerId: '1',
      comment: newReview.comment,
      rating: newReview.rating,
    };

    const initialState = {
      currentOffer: null,
      nearbyOffers: [],
      reviews: [oldReview],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      sendReviewAction.fulfilled(newReview, '', reviewPost)
    );

    expect(result.reviews).toEqual([newReview, oldReview]);
  });

  it('should update offer in "nearbyOffers" with "changeFavoriteStatusAction.fulfilled"', () => {
    const offer = makeFakeOffer('1');
    const anotherOffer = makeFakeOffer('2');

    const updatedOffer = {
      ...offer,
      isFavorite: true,
    };

    const initialState = {
      currentOffer: null,
      nearbyOffers: [offer, anotherOffer],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: offer.id,
        status: 1,
      })
    );

    expect(result.nearbyOffers).toEqual([updatedOffer, anotherOffer]);
  });

  it('should update "isFavorite" in "currentOffer" with "changeFavoriteStatusAction.fulfilled"', () => {
    const currentOffer = makeFakeOfferDetails('1');

    const updatedOffer = {
      ...makeFakeOffer(currentOffer.id),
      isFavorite: true,
    };

    const initialState = {
      currentOffer,
      nearbyOffers: [],
      reviews: [],
      isOfferLoading: false,
      isOfferNotFound: false,
    };

    const result = offerData.reducer(
      initialState,
      changeFavoriteStatusAction.fulfilled(updatedOffer, '', {
        offerId: currentOffer.id,
        status: 1,
      })
    );

    expect(result.currentOffer).toEqual({
      ...currentOffer,
      isFavorite: true,
    });
  });
});

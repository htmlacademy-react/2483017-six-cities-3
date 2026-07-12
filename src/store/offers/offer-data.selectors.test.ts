import { NameSpace } from '../../const';
import {
  makeFakeOffer,
  makeFakeOfferDetails,
  makeFakeReview,
  makeFakeStore,
} from '../../utils/mocks';
import {
  selectCurrentOffer,
  selectCurrentOfferIsFavorite,
  selectNearbyOffers,
  selectOfferLoadingStatus,
  selectOfferNotFoundStatus,
  selectReviews,
} from './offer-data.selectors';

describe('Offer data selectors', () => {
  it('should return current offer from state', () => {
    const currentOffer = makeFakeOfferDetails();

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        currentOffer,
      },
    });

    expect(selectCurrentOffer(state)).toBe(currentOffer);
  });

  it('should return nearby offers from state', () => {
    const nearbyOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        nearbyOffers,
      },
    });

    expect(selectNearbyOffers(state)).toBe(nearbyOffers);
  });

  it('should return reviews from state', () => {
    const reviews = [
      makeFakeReview('1'),
      makeFakeReview('2'),
    ];

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        reviews,
      },
    });

    expect(selectReviews(state)).toBe(reviews);
  });

  it('should return offer loading status from state', () => {
    const isOfferLoading = true;

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        isOfferLoading,
      },
    });

    expect(
      selectOfferLoadingStatus(state),
    ).toBe(isOfferLoading);
  });

  it('should return offer not found status from state', () => {
    const isOfferNotFound = true;

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        isOfferNotFound,
      },
    });

    expect(
      selectOfferNotFoundStatus(state),
    ).toBe(isOfferNotFound);
  });

  it('should return true when current offer is favorite', () => {
    const currentOffer = {
      ...makeFakeOfferDetails(),
      isFavorite: true,
    };

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        currentOffer,
      },
    });

    expect(
      selectCurrentOfferIsFavorite(state),
    ).toBe(true);
  });

  it('should return false when current offer is not favorite', () => {
    const currentOffer = {
      ...makeFakeOfferDetails(),
      isFavorite: false,
    };

    const state = makeFakeStore({
      [NameSpace.Offer]: {
        currentOffer,
      },
    });

    expect(
      selectCurrentOfferIsFavorite(state),
    ).toBe(false);
  });

  it('should return false when current offer is null', () => {
    const state = makeFakeStore({
      [NameSpace.Offer]: {
        currentOffer: null,
      },
    });

    expect(
      selectCurrentOfferIsFavorite(state),
    ).toBe(false);
  });
});

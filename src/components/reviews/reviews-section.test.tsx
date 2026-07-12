import { render, screen } from '@testing-library/react';
import {
  AuthorizationStatus,
  NameSpace,
} from '../../const';
import { withStore } from '../../utils/mock-component';
import {
  makeFakeReview,
  makeFakeStore,
} from '../../utils/mocks';
import ReviewsSection from './reviews-section';

vi.mock('./reviews-list', () => ({
  default: ({
    reviews,
  }: {
    reviews: ReturnType<typeof makeFakeReview>[];
  }) => (
    <div data-testid="reviews-list">
      Reviews count: {reviews.length}
    </div>
  ),
}));

vi.mock('./review-form', () => ({
  default: ({offerId}: {offerId: string}) => (
    <form
      data-testid="review-form"
      data-offer-id={offerId}
    >
      Review form
    </form>
  ),
}));

describe('Component: ReviewsSection', () => {
  it('should render reviews list', () => {
    const mockReviews = [
      makeFakeReview('1'),
      makeFakeReview('2'),
    ];

    const {withStoreComponent} = withStore(
      <ReviewsSection offerId="offer-id" />,
      makeFakeStore({
        [NameSpace.Offer]: {
          reviews: mockReviews,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByTestId('reviews-list'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        `Reviews count: ${mockReviews.length}`,
      ),
    ).toBeInTheDocument();
  });

  it('should render review form when user is authorized', () => {
    const offerId = 'offer-id';

    const {withStoreComponent} = withStore(
      <ReviewsSection offerId={offerId} />,
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
        },
      }),
    );

    render(withStoreComponent);

    const reviewForm = screen.getByTestId('review-form');

    expect(reviewForm).toBeInTheDocument();
    expect(reviewForm).toHaveAttribute(
      'data-offer-id',
      offerId,
    );
  });

  it('should not render review form when user is not authorized', () => {
    const {withStoreComponent} = withStore(
      <ReviewsSection offerId="offer-id" />,
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.NoAuth,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.queryByTestId('review-form'),
    ).not.toBeInTheDocument();
  });
});

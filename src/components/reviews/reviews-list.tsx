import { useMemo } from 'react';
import { Review as ReviewType } from '../../types/review';
import Review from '../reviews/review';
import { REVIEWS_LIMIT } from '../../const';

type ReviewsListProps = {
  reviews: ReviewType[];
};

function ReviewsList({reviews}: ReviewsListProps) {
  const sortedReviews = useMemo(
    () => [...reviews]
      .sort((reviewA, reviewB) =>
        new Date(reviewB.date).getTime() - new Date(reviewA.date).getTime()
      )
      .slice(0, REVIEWS_LIMIT),
    [reviews]
  );

  return (
    <>
      <h2 className="reviews__title">
        Reviews &middot; <span className="reviews__amount">{reviews.length}</span>
      </h2>

      <ul className="reviews__list">
        {sortedReviews.map((review) => (
          <Review key={review.id} review={review} />
        ))}
      </ul>
    </>
  );
}

export default ReviewsList;

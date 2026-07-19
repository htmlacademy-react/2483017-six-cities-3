import { memo } from 'react';
import { AuthorizationStatus } from '../../const';
import { useAppSelector } from '../../hooks';
import ReviewForm from './review-form';
import ReviewsList from './reviews-list';
import { selectAuthorizationStatus } from '../../store/user-process';
import { selectReviews } from '../../store/offers';

type ReviewsSectionProps = {
  offerId: string;
};

function ReviewsSection({offerId}: ReviewsSectionProps) {
  const reviews = useAppSelector(selectReviews);
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return (
    <section className="offer__reviews reviews">
      <ReviewsList reviews={reviews} />
      {authorizationStatus === AuthorizationStatus.Auth && (
        <ReviewForm offerId={offerId} />
      )}
    </section>
  );
}

const MemoizedReviewsSection = memo(ReviewsSection);

export default MemoizedReviewsSection;

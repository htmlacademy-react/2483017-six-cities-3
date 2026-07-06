import { STAR_WIDTH_PERCENT } from '../../const';
import { Review as ReviewType } from '../../types/review';
import { formatReviewDate } from '../../utils';

type ReviewProps = {
  review: ReviewType;
};

function Review({review}: ReviewProps) {
  const {
    date,
    user,
    comment,
    rating,
  } = review;

  return (
    <li className="reviews__item">
      <div className="reviews__user user">
        <div className="reviews__avatar-wrapper user__avatar-wrapper">
          <img
            className="reviews__avatar user__avatar"
            src={user.avatarUrl}
            width="54"
            height="54"
            alt="Reviews avatar"
          />
        </div>
        <span className="reviews__user-name">
          {user.name}
        </span>
      </div>
      <div className="reviews__info">
        <div className="reviews__rating rating">
          <div className="reviews__stars rating__stars">
            <span style={{width: `${rating * STAR_WIDTH_PERCENT}%`}}></span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <p className="reviews__text">
          {comment}
        </p>
        <time className="reviews__time" dateTime={date}>{formatReviewDate(date)}</time>
      </div>
    </li>
  );
}

export default Review;

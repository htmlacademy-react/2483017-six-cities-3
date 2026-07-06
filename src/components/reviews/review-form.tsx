import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { MIN_REVIEW_LENGTH, MAX_REVIEW_LENGTH } from '../../const';
import { sendReviewAction } from '../../store/api-actions';

type ReviewFormProps = {
  offerId: string;
};

type ReviewFormData = {
  rating: string;
  review: string;
};

function ReviewForm({offerId}: ReviewFormProps) {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: '',
    review: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitDisabled =
    isSubmitting ||
    !formData.rating ||
    formData.review.length < MIN_REVIEW_LENGTH ||
    formData.review.length > MAX_REVIEW_LENGTH;

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      rating: evt.target.value,
    });
  };

  const handleReviewChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      review: evt.target.value,
    });
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    dispatch(sendReviewAction({
      offerId,
      comment: formData.review,
      rating: Number(formData.rating),
    }))

      .then((result) => {
        if (sendReviewAction.fulfilled.match(result)) {
          setFormData({
            rating: '',
            review: '',
          });
        }

        if (sendReviewAction.rejected.match(result)) {
          setErrorMessage('Failed to send review. Please try again.');
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <form
      className="reviews__form form"
      action="#"
      method="post"
      onSubmit={handleSubmit}
    >
      <label className="reviews__label form__label" htmlFor="review">Your review</label>
      <div className="reviews__rating-form form__rating">
        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="5"
          id="5-stars"
          type="radio"
          checked={formData.rating === '5'}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        <label htmlFor="5-stars" className="reviews__rating-label form__rating-label" title="perfect">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="4"
          id="4-stars"
          type="radio"
          checked={formData.rating === '4'}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        <label htmlFor="4-stars" className="reviews__rating-label form__rating-label" title="good">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="3"
          id="3-stars"
          type="radio"
          checked={formData.rating === '3'}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        <label htmlFor="3-stars" className="reviews__rating-label form__rating-label" title="not bad">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="2"
          id="2-stars"
          type="radio"
          checked={formData.rating === '2'}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        <label htmlFor="2-stars" className="reviews__rating-label form__rating-label" title="badly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>

        <input
          className="form__rating-input visually-hidden"
          name="rating"
          value="1"
          id="1-star"
          type="radio"
          checked={formData.rating === '1'}
          onChange={handleRatingChange}
          disabled={isSubmitting}
        />
        <label htmlFor="1-star" className="reviews__rating-label form__rating-label" title="terribly">
          <svg className="form__star-image" width="37" height="33">
            <use xlinkHref="#icon-star"></use>
          </svg>
        </label>
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={formData.review}
        onChange={handleReviewChange}
        disabled={isSubmitting}
      />

      {errorMessage && (
        <p className="reviews__help" style={{color: 'red'}}>
          {errorMessage}
        </p>
      )}
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;

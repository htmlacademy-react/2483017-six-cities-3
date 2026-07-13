import { ChangeEvent, Fragment, FormEvent, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { RATING_OPTIONS, ReviewLength } from '../../const';
import { sendReviewAction } from '../../store/api-actions';

type RatingValue = typeof RATING_OPTIONS[number]['value'];

type ReviewFormProps = {
  offerId: string;
};

type ReviewFormData = {
  rating: RatingValue | '';
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
    formData.review.length < ReviewLength.Min ||
    formData.review.length > ReviewLength.Max;

  const handleRatingChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const rating = evt.currentTarget.value as RatingValue;

    setFormData((previousFormData) => ({
      ...previousFormData,
      rating,
    }));
  };

  const handleReviewChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const review = evt.currentTarget.value;

    setFormData({
      ...formData,
      review,
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
        {RATING_OPTIONS.map(({value, title, id}) => (
          <Fragment key={value}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={id}
              type="radio"
              checked={formData.rating === value}
              onChange={handleRatingChange}
              disabled={isSubmitting}
            />
            <label
              className="reviews__rating-label form__rating-label"
              htmlFor={id}
              title={title}
            >
              <svg
                className="form__star-image"
                width="37"
                height="33"
              >
                <use href="#icon-star" />
              </svg>
            </label>
          </Fragment>
        ))}
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
          To submit review please make sure to set <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{ReviewLength.Min} characters</b>.
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

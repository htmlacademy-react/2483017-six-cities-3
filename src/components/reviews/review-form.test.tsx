import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  APIRoute,
  MAX_REVIEW_LENGTH,
  MIN_REVIEW_LENGTH,
} from '../../const';
import { sendReviewAction } from '../../store/api-actions';
import { withStore } from '../../utils/mock-component';
import {
  extractActionsTypes,
  makeFakeReview,
  makeFakeStore,
} from '../../utils/mocks';
import ReviewForm from './review-form';

describe('Component: ReviewForm', () => {
  const offerId = 'offer-id';

  it('should render review form', () => {
    const { withStoreComponent } = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole('radio'),
    ).toHaveLength(5);

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeInTheDocument();
  });

  it('should keep submit button disabled when form is empty', () => {
    const {withStoreComponent} = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeDisabled();
  });

  it('should keep submit button disabled when rating is not selected', async () => {
    const user = userEvent.setup();
    const validReview = 'a'.repeat(MIN_REVIEW_LENGTH);

    const {withStoreComponent} = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    await user.type(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
      validReview,
    );

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeDisabled();
  });

  it('should keep submit button disabled when review is too short', async () => {
    const user = userEvent.setup();
    const shortReview = 'a'.repeat(MIN_REVIEW_LENGTH - 1);

    const {withStoreComponent} = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByDisplayValue('5'),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
      shortReview,
    );

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeDisabled();
  });

  it('should enable submit button when rating and valid review are entered', async () => {
    const user = userEvent.setup();
    const validReview = 'a'.repeat(MIN_REVIEW_LENGTH);

    const {withStoreComponent} = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByDisplayValue('5'),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
      validReview,
    );

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeEnabled();
  });

  it('should keep submit button disabled when review is too long', async () => {
    const user = userEvent.setup();
    const longReview = 'a'.repeat(MAX_REVIEW_LENGTH + 1);

    const {withStoreComponent} = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByDisplayValue('5'),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
      longReview,
    );

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeDisabled();
  });

  it('should dispatch "sendReviewAction" with entered data when user submits valid form', async () => {
    const user = userEvent.setup();
    const rating = 5;
    const validReview = 'a'.repeat(MIN_REVIEW_LENGTH);
    const mockReview = makeFakeReview();

    const {
      withStoreComponent,
      mockStore,
      mockAxiosAdapter,
    } = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${offerId}`, {
        comment: validReview,
        rating,
      })
      .reply(200, mockReview);

    render(withStoreComponent);

    await user.click(
      screen.getByDisplayValue(String(rating)),
    );

    await user.type(
      screen.getByRole('textbox', {
        name: 'Your review',
      }),
      validReview,
    );

    await user.click(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    );

    await waitFor(() => {
      const actions = extractActionsTypes(
        mockStore.getActions(),
      );

      expect(actions).toEqual([
        sendReviewAction.pending.type,
        sendReviewAction.fulfilled.type,
      ]);
    });
  });

  it('should clear review and rating after successful submit', async () => {
    const user = userEvent.setup();
    const rating = 5;
    const validReview = 'a'.repeat(MIN_REVIEW_LENGTH);
    const mockReview = makeFakeReview();

    const {
      withStoreComponent,
      mockAxiosAdapter,
    } = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${offerId}`)
      .reply(200, mockReview);

    render(withStoreComponent);

    const ratingInput = screen.getByDisplayValue(
      String(rating),
    );

    const reviewTextarea = screen.getByRole('textbox', {
      name: 'Your review',
    });

    await user.click(ratingInput);
    await user.type(reviewTextarea, validReview);

    await user.click(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    );

    await waitFor(() => {
      expect(reviewTextarea).toHaveValue('');
      expect(ratingInput).not.toBeChecked();
    });

    expect(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    ).toBeDisabled();
  });

  it('should show error and keep entered data when server response is 400', async () => {
    const user = userEvent.setup();
    const rating = 4;
    const validReview = 'a'.repeat(MIN_REVIEW_LENGTH);

    const {
      withStoreComponent,
      mockAxiosAdapter,
    } = withStore(
      <ReviewForm offerId={offerId} />,
      makeFakeStore(),
    );

    mockAxiosAdapter
      .onPost(`${APIRoute.Comments}/${offerId}`)
      .reply(400);

    render(withStoreComponent);

    const ratingInput = screen.getByDisplayValue(
      String(rating),
    );

    const reviewTextarea = screen.getByRole('textbox', {
      name: 'Your review',
    });

    await user.click(ratingInput);
    await user.type(reviewTextarea, validReview);

    await user.click(
      screen.getByRole('button', {
        name: 'Submit',
      }),
    );

    expect(
      await screen.findByText(
        'Failed to send review. Please try again.',
      ),
    ).toBeInTheDocument();

    expect(reviewTextarea).toHaveValue(validReview);
    expect(ratingInput).toBeChecked();

    await waitFor(() => {
      expect(reviewTextarea).toBeEnabled();
      expect(ratingInput).toBeEnabled();

      expect(
        screen.getByRole('button', {
          name: 'Submit',
        }),
      ).toBeEnabled();
    });
  });
});

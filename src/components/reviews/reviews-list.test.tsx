import { render, screen } from '@testing-library/react';
import { makeFakeReview } from '../../utils/mocks';
import ReviewsList from './reviews-list';

describe('Component: ReviewsList', () => {
  it('should render correct', () => {
    const mockReviews = [
      makeFakeReview('1'),
      makeFakeReview('2'),
    ];

    render(<ReviewsList reviews={mockReviews} />);

    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
    expect(screen.getByText(String(mockReviews.length))).toBeInTheDocument();

    mockReviews.forEach((review) => {
      expect(screen.getByText(review.comment)).toBeInTheDocument();
    });
  });
});

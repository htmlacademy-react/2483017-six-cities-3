import { render, screen } from '@testing-library/react';
import { makeFakeReview } from '../../utils/mocks';
import Review from './review';

describe('Component: Review', () => {
  it('should render correct', () => {
    const mockReview = makeFakeReview('1');

    render(<Review review={mockReview} />);

    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
    expect(screen.getByAltText('Reviews avatar')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
  });
});

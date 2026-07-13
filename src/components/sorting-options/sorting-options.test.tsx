import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortOption, SORT_OPTIONS } from '../../const';
import SortingOptions from './sorting-options';

describe('Component: SortingOptions', () => {
  it('should render all sort options', () => {
    render(
      <SortingOptions
        activeSortOption={SortOption.Popular}
        onSortOptionChange={vi.fn()}
      />,
    );

    SORT_OPTIONS.forEach((sortOption) => {
      expect(
        screen.getAllByText(sortOption).length,
      ).toBeGreaterThan(0);
    });
  });

  it('should mark current sort option as active', () => {
    const activeSortOption = SortOption.PriceLowToHigh;

    render(
      <SortingOptions
        activeSortOption={activeSortOption}
        onSortOptionChange={vi.fn()}
      />,
    );

    const activeOptionElements = screen.getAllByText(activeSortOption);
    const activeListOption = activeOptionElements.find(
      (element) => element.tagName === 'LI',
    );

    expect(activeListOption).toBeDefined();
    expect(activeListOption).toHaveClass('places__option--active');
  });

  it('should call "onSortOptionChange" with selected option when user clicks it', async () => {
    const user = userEvent.setup();
    const handleSortOptionChange = vi.fn();
    const selectedSortOption = SortOption.PriceHighToLow;

    render(
      <SortingOptions
        activeSortOption={SortOption.Popular}
        onSortOptionChange={handleSortOptionChange}
      />,
    );

    await user.click(screen.getByText(selectedSortOption));

    expect(handleSortOptionChange).toHaveBeenCalledTimes(1);
    expect(handleSortOptionChange).toHaveBeenCalledWith(selectedSortOption);
  });

  it('should be closed by default and open when user clicks current sort option', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <SortingOptions
        activeSortOption={SortOption.Popular}
        onSortOptionChange={vi.fn()}
      />,
    );

    const optionsList = container.querySelector('.places__options');

    const currentSortOption = screen
      .getAllByText(SortOption.Popular)
      .find((element) => element.tagName === 'SPAN');

    expect(optionsList).not.toHaveClass('places__options--opened');
    expect(currentSortOption).toBeDefined();

    await user.click(currentSortOption!);

    expect(optionsList).toHaveClass('places__options--opened');
  });

  it('should close options list after user selects sort option', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <SortingOptions
        activeSortOption={SortOption.Popular}
        onSortOptionChange={vi.fn()}
      />,
    );

    const optionsList = container.querySelector('.places__options');

    const currentSortOption = screen
      .getAllByText(SortOption.Popular)
      .find((element) => element.tagName === 'SPAN');

    expect(optionsList).not.toHaveClass('places__options--opened');
    expect(currentSortOption).toBeDefined();

    await user.click(currentSortOption!);

    expect(optionsList).toHaveClass('places__options--opened');

    await user.click(screen.getByText(SortOption.PriceLowToHigh));

    expect(optionsList).not.toHaveClass('places__options--opened');
  });
});

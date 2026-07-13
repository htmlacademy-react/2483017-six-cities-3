import { memo, useState } from 'react';
import classNames from 'classnames';
import { SortOption, SORT_OPTIONS } from '../../const';

type SortingOptionsProps = {
  activeSortOption: SortOption;
  onSortOptionChange: (sortOption: SortOption) => void;
};

function SortingOptions({
  activeSortOption,
  onSortOptionChange
}: SortingOptionsProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleSortTypeClick = () => {
    setIsOpened((prevState) => !prevState);
  };

  const handleSortOptionClick = (sortOption: SortOption) => {
    onSortOptionChange(sortOption);
    setIsOpened(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={handleSortTypeClick}
      >
        {activeSortOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul
        className={classNames(
          'places__options',
          'places__options--custom',
          {'places__options--opened': isOpened}
        )}
      >
        {SORT_OPTIONS.map((sortOption) => (
          <li
            className={classNames(
              'places__option',
              {'places__option--active': sortOption === activeSortOption}
            )}
            tabIndex={0}
            key={sortOption}
            onClick={() => handleSortOptionClick(sortOption)}
          >
            {sortOption}
          </li>
        ))}
      </ul>
    </form>
  );
}

const MemoizedSortingOptions = memo(SortingOptions);

export default MemoizedSortingOptions;

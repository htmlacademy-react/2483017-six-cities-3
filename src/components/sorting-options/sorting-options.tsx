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
  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span className="places__sorting-type" tabIndex={0}>
        {activeSortOption}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      <ul className="places__options places__options--custom places__options--opened">
        {SORT_OPTIONS.map((sortOption) => (
          <li
            className={classNames(
              'places__option',
              {'places__option--active': sortOption === activeSortOption}
            )}
            tabIndex={0}
            key={sortOption}
            onClick={() => onSortOptionChange(sortOption)}
          >
            {sortOption}
          </li>
        ))}
      </ul>
    </form>
  );
}

export default SortingOptions;

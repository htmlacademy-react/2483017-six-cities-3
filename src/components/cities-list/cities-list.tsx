import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { changeCity, selectCity } from '../../store/app-process';
import { AppRoute, CITIES } from '../../const';

function CitiesList() {
  const dispatch = useAppDispatch();

  const activeCity = useAppSelector(selectCity);

  const handleCityClick = useCallback((selectedCityName: string) => {
    dispatch(changeCity(selectedCityName));
  }, [dispatch]);

  return (
    <ul className="locations__list tabs__list">
      {CITIES.map((city) => (
        <li className="locations__item" key={city}>
          <Link
            to={AppRoute.Main}
            className={classNames(
              'locations__item-link',
              'tabs__item',
              {
                'tabs__item--active': city === activeCity,
              }
            )}
            onClick={() => handleCityClick(city)}
          >
            <span>{city}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const MemoizedCitiesList = memo(CitiesList);

export default MemoizedCitiesList;

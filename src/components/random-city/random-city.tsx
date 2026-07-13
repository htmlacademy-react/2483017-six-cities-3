import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute, CITIES } from '../../const';
import { useAppDispatch } from '../../hooks';
import { changeCity } from '../../store/app-process';

function RandomCity() {
  const dispatch = useAppDispatch();

  const randomCity = useMemo(
    () => CITIES[Math.floor(Math.random() * CITIES.length)],
    [],
  );

  const handleCityClick = () => {
    dispatch(changeCity(randomCity));
  };

  return (
    <section className="locations locations--login locations--current">
      <div className="locations__item">
        <Link
          className="locations__item-link"
          to={AppRoute.Main}
          onClick={handleCityClick}
        >
          <span>{randomCity}</span>
        </Link>
      </div>
    </section>
  );
}

export default RandomCity;

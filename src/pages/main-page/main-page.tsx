import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute,SortOption } from '../../const';
import OffersList from '../../components/offer-list/offer-list';
import Map from '../../components/map/map';
import { useAppDispatch, useAppSelector } from '../../hooks';
import CitiesList from '../../components/cities-list/cities-list';
import { City, Offer } from '../../types/offer';
import { changeCity } from '../../store/action';
import { cities } from '../../mocks/cities';
import SortingOptions from '../../components/sorting-options/sorting-options';

const getSortedOffers = (
  offers: Offer[],
  sortOption: SortOption
) => {
  switch (sortOption) {
    case SortOption.PriceLowToHigh:
      return [...offers].sort((firstOffer, secondOffer) => firstOffer.price - secondOffer.price);

    case SortOption.PriceHighToLow:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.price - firstOffer.price);

    case SortOption.TopRatedFirst:
      return [...offers].sort((firstOffer, secondOffer) => secondOffer.rating - firstOffer.rating);

    case SortOption.Popular:
      return [...offers];
  }
};

function MainPage() {
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [activeSortOption, setActiveSortOption] = useState(SortOption.Popular);

  const dispatch = useAppDispatch();

  const city = useAppSelector((state) => state.city);

  const offers = useAppSelector((state) => state.offers);

  const currentCityOffers = offers.filter(
    (offer) => offer.city.name === city.name
  );

  const sortedOffers = getSortedOffers(currentCityOffers, activeSortOption);

  const favoriteOffersCount = offers.filter((offer) => offer.isFavorite).length;

  const selectedOffer = currentCityOffers.find((offer) => offer.id === activeOfferId);

  const handleCityClick = (selectedCity: City) => {
    setActiveOfferId(null);
    dispatch(changeCity(selectedCity));
  };

  return (
    <div className="page page--gray page--main">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Link className="header__logo-link header__logo-link--active" to={AppRoute.Main}>
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </Link>
            </div>
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li className="header__nav-item user">
                  <Link className="header__nav-link header__nav-link--profile" to={AppRoute.Favorites}>
                    <div className="header__avatar-wrapper user__avatar-wrapper">
                    </div>
                    <span className="header__user-name user__name">Oliver.conner@gmail.com</span>
                    <span className="header__favorite-count">{favoriteOffersCount}</span>
                  </Link>
                </li>
                <li className="header__nav-item">
                  <a className="header__nav-link" href="#">
                    <span className="header__signout">Sign out</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList
              cities={cities}
              activeCity={city}
              onCityClick={handleCityClick}
            />
          </section>
        </div>
        <div className="cities">
          <div className="cities__places-container container">
            <section className="cities__places places">
              <h2 className="visually-hidden">Places</h2>
              <b className="places__found">{currentCityOffers.length} places to stay in {city.name}</b>
              <SortingOptions
                activeSortOption={activeSortOption}
                onSortOptionChange={setActiveSortOption}
              />
              <OffersList
                offers={sortedOffers}
                onCardMouseEnter={setActiveOfferId}
                onCardMouseLeave={() => setActiveOfferId(null)}
              />
            </section>
            <div className="cities__right-section">
              <Map
                city={city}
                offers={currentCityOffers}
                selectedOffer={selectedOffer}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MainPage;

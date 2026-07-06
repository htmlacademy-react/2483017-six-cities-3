import CitiesList from '../../components/cities-list/cities-list';
import Header from '../../components/header/header';
import OffersSection from '../../components/offers/offers-section';
import { useAppSelector } from '../../hooks';
import Spinner from '../../components/spinner/spinner';
import { selectOffersLoadingStatus } from '../../store/offers';

function MainPage() {
  const isOffersLoading = useAppSelector(selectOffersLoadingStatus);

  if (isOffersLoading) {
    return (
      <div className="page page--gray page--main">
        <Header />

        <main className="page__main page__main--index">
          <Spinner />
        </main>
      </div>
    );
  }

  return (
    <div className="page page--gray page--main">
      <Header isMainPage />

      <main className="page__main page__main--index">
        <h1 className="visually-hidden">Cities</h1>
        <div className="tabs">
          <section className="locations container">
            <CitiesList />
          </section>
        </div>
        <OffersSection />
      </main>
    </div>
  );
}

export default MainPage;

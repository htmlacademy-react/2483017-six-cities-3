import CitiesList from '../../components/cities-list/cities-list';
import Header from '../../components/header/header';
import OffersSection from '../../components/offers/offers-section';

function MainPage() {

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

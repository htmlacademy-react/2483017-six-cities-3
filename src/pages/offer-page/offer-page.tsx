import { useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { Limits } from '../../const';
import Map from '../../components/map/map';
import NearbyOffersList from '../../components/offers/nearby-offers-list';
import { useAppDispatch, useAppSelector } from '../../hooks';
import Header from '../../components/header/header';
import {
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchReviewsAction,
} from '../../store/api-actions';
import OfferInfo from '../../components/offers/offer-info';
import {
  selectCurrentOffer,
  selectNearbyOffers,
  selectOfferLoadingStatus,
  selectOfferNotFoundStatus,
  selectOfferLoadingErrorStatus,
  resetOfferData,
} from '../../store/offers';
import NotFoundPage from '../not-found-page/not-found-page';
import ServerError from '../../components/server-error/server-error';

function OfferPage() {
  const dispatch = useAppDispatch();
  const {id} = useParams();

  const currentOffer = useAppSelector(selectCurrentOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const isOfferLoading = useAppSelector(selectOfferLoadingStatus);
  const isOfferNotFound = useAppSelector(selectOfferNotFoundStatus);

  const isOfferLoadingError = useAppSelector(
    selectOfferLoadingErrorStatus,
  );

  useEffect(() => {
    dispatch(resetOfferData());

    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [id, dispatch]);

  const nearbyOffersLimited = useMemo(
    () => nearbyOffers.slice(0, Limits.NearbyOffers),
    [nearbyOffers]
  );

  const mapOffers = useMemo(
    () => currentOffer ? [currentOffer, ...nearbyOffersLimited] : nearbyOffersLimited,
    [currentOffer, nearbyOffersLimited]
  );

  if (isOfferNotFound) {
    return <NotFoundPage />;
  }

  if (isOfferLoadingError) {
    return (
      <div className="page">
        <Header />

        <main className="page__main page__main--offer">
          <ServerError />
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        {currentOffer && !isOfferLoading && (
          <>
            <section className="offer">
              <div className="offer__gallery-container container">
                <div className="offer__gallery">
                  {currentOffer.images.slice(0, Limits.OfferImages).map((image) => (
                    <div className="offer__image-wrapper" key={image}>
                      <img
                        className="offer__image"
                        src={image}
                        alt="Photo studio"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <OfferInfo offer={currentOffer} />
              <Map
                city={currentOffer.city}
                offers={mapOffers}
                selectedOffer={currentOffer}
                className="offer__map map"
              />
            </section>
            <div className="container">
              <section className="near-places places">
                <h2 className="near-places__title">Other places in the neighbourhood</h2>
                <NearbyOffersList offers={nearbyOffersLimited} />
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default OfferPage;

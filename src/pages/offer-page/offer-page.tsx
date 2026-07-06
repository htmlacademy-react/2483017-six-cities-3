import { Navigate, useParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  AppRoute,
  NEARBY_OFFERS_LIMIT,
  OFFER_IMAGES_LIMIT,
} from '../../const';
import Map from '../../components/map/map';
import Spinner from '../../components/spinner/spinner';
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
} from '../../store/offers';

function OfferPage() {
  const dispatch = useAppDispatch();
  const {id} = useParams();

  const currentOffer = useAppSelector(selectCurrentOffer);
  const nearbyOffers = useAppSelector(selectNearbyOffers);
  const isOfferLoading = useAppSelector(selectOfferLoadingStatus);
  const isOfferNotFound = useAppSelector(selectOfferNotFoundStatus);

  useEffect(() => {
    if (id) {
      dispatch(fetchOfferAction(id));
      dispatch(fetchNearbyOffersAction(id));
      dispatch(fetchReviewsAction(id));
    }
  }, [id, dispatch]);

  const nearbyOffersLimited = useMemo(
    () => nearbyOffers.slice(0, NEARBY_OFFERS_LIMIT),
    [nearbyOffers]
  );

  const mapOffers = useMemo(
    () => currentOffer ? [currentOffer, ...nearbyOffersLimited] : nearbyOffersLimited,
    [currentOffer, nearbyOffersLimited]
  );

  if (isOfferNotFound) {
    return <Navigate to={AppRoute.NotFound} replace />;
  }

  if (isOfferLoading || !currentOffer) {
    return <Spinner />;
  }

  const {
    city,
    images,
  } = currentOffer;

  return (
    <div className="page">
      <Header />

      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {images.slice(0, OFFER_IMAGES_LIMIT).map((image) => (
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
            city={city}
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
      </main>
    </div>
  );
}

export default OfferPage;

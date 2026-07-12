import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { createAPI } from '../services/api';
import * as tokenStorage from '../services/token';
import { State } from '../types/state';
import {
  AppThunkDispatch,
  extractActionsTypes,
  makeFakeOffer,
  makeFakeOfferDetails,
  makeFakeReview,
  makeFakeUserData,
  makeFakeAuthData,
} from '../utils/mocks';
import { APIRoute } from '../const';
import {
  changeFavoriteStatusAction,
  checkAuthAction,
  fetchFavoriteOffersAction,
  fetchNearbyOffersAction,
  fetchOfferAction,
  fetchOffersAction,
  fetchReviewsAction,
  loginAction,
  logoutAction,
  sendReviewAction,
} from './api-actions';
import { resetOffersFavoriteStatus } from './offers';

describe('Async actions', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<
    State,
    Action<string>,
    AppThunkDispatch
  >(middleware);

  let mockStore: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    mockAxiosAdapter.reset();
    mockStore = mockStoreCreator({});
  });

  describe('fetchOffersAction', () => {

    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.fulfilled" when server response 200', async () => {
      const mockOffers = [
        makeFakeOffer('1'),
        makeFakeOffer('2'),
      ];

      mockAxiosAdapter.onGet(APIRoute.Offers).reply(200, mockOffers);

      await mockStore.dispatch(fetchOffersAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.fulfilled.type,
      ]);
    });

    it('should dispatch "fetchOffersAction.pending" and "fetchOffersAction.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(APIRoute.Offers).reply(400);

      await mockStore.dispatch(fetchOffersAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchOffersAction.pending.type,
        fetchOffersAction.rejected.type,
      ]);
    });
  });

  describe('fetchOfferAction', () => {
    it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.fulfilled" when server response 200', async () => {
      const mockOffer = makeFakeOfferDetails('1');

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${mockOffer.id}`)
        .reply(200, mockOffer);

      await mockStore.dispatch(fetchOfferAction(mockOffer.id));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchOfferAction.pending.type,
        fetchOfferAction.fulfilled.type,
      ]);
    });

    it('should dispatch "fetchOfferAction.pending" and "fetchOfferAction.rejected" when server response 400', async () => {
      const offerId = '1';

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}`)
        .reply(400);

      await mockStore.dispatch(fetchOfferAction(offerId));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchOfferAction.pending.type,
        fetchOfferAction.rejected.type,
      ]);
    });
  });

  describe('fetchNearbyOffersAction', () => {
    it('should dispatch "fetchNearbyOffersAction.pending" and "fetchNearbyOffersAction.fulfilled" when server response 200', async () => {
      const offerId = '1';
      const mockNearbyOffers = [
        makeFakeOffer('2'),
        makeFakeOffer('3'),
      ];

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}/nearby`)
        .reply(200, mockNearbyOffers);

      await mockStore.dispatch(fetchNearbyOffersAction(offerId));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchNearbyOffersAction.pending.type,
        fetchNearbyOffersAction.fulfilled.type,
      ]);
    });

    it('should dispatch "fetchNearbyOffersAction.pending" and "fetchNearbyOffersAction.rejected" when server response 400', async () => {
      const offerId = '1';

      mockAxiosAdapter
        .onGet(`${APIRoute.Offers}/${offerId}/nearby`)
        .reply(400);

      await mockStore.dispatch(fetchNearbyOffersAction(offerId));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchNearbyOffersAction.pending.type,
        fetchNearbyOffersAction.rejected.type,
      ]);
    });
  });

  describe('fetchReviewsAction', () => {
    it('should dispatch "fetchReviewsAction.pending" and "fetchReviewsAction.fulfilled" when server response 200', async () => {
      const offerId = '1';
      const mockReviews = [
        makeFakeReview('1'),
        makeFakeReview('2'),
      ];

      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${offerId}`)
        .reply(200, mockReviews);

      await mockStore.dispatch(fetchReviewsAction(offerId));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.fulfilled.type,
      ]);
    });

    it('should dispatch "fetchReviewsAction.pending" and "fetchReviewsAction.rejected" when server response 400', async () => {
      const offerId = '1';

      mockAxiosAdapter
        .onGet(`${APIRoute.Comments}/${offerId}`)
        .reply(400);

      await mockStore.dispatch(fetchReviewsAction(offerId));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchReviewsAction.pending.type,
        fetchReviewsAction.rejected.type,
      ]);
    });
  });

  describe('sendReviewAction', () => {
    it('should dispatch "sendReviewAction.pending" and "sendReviewAction.fulfilled" when server response 200', async () => {
      const offerId = '1';
      const mockReview = makeFakeReview('1');

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${offerId}`)
        .reply(200, mockReview);

      await mockStore.dispatch(sendReviewAction({
        offerId,
        comment: mockReview.comment,
        rating: mockReview.rating,
      }));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        sendReviewAction.pending.type,
        sendReviewAction.fulfilled.type,
      ]);
    });

    it('should dispatch "sendReviewAction.pending" and "sendReviewAction.rejected" when server response 400', async () => {
      const offerId = '1';
      const mockReview = makeFakeReview('1');

      mockAxiosAdapter
        .onPost(`${APIRoute.Comments}/${offerId}`)
        .reply(400);

      await mockStore.dispatch(sendReviewAction({
        offerId,
        comment: mockReview.comment,
        rating: mockReview.rating,
      }));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        sendReviewAction.pending.type,
        sendReviewAction.rejected.type,
      ]);
    });
  });

  describe('fetchFavoriteOffersAction', () => {
    it('should dispatch "fetchFavoriteOffersAction.pending" and "fetchFavoriteOffersAction.fulfilled" when server response 200', async () => {
      const mockFavoriteOffers = [
        {
          ...makeFakeOffer('1'),
          isFavorite: true,
        },
        {
          ...makeFakeOffer('2'),
          isFavorite: true,
        },
      ];

      mockAxiosAdapter
        .onGet(APIRoute.Favorite)
        .reply(200, mockFavoriteOffers);

      await mockStore.dispatch(fetchFavoriteOffersAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.fulfilled.type,
      ]);
    });

    it('should dispatch "fetchFavoriteOffersAction.pending" and "fetchFavoriteOffersAction.rejected" when server response 400', async () => {
      mockAxiosAdapter
        .onGet(APIRoute.Favorite)
        .reply(400);

      await mockStore.dispatch(fetchFavoriteOffersAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        fetchFavoriteOffersAction.pending.type,
        fetchFavoriteOffersAction.rejected.type,
      ]);
    });
  });

  describe('changeFavoriteStatusAction', () => {
    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.fulfilled" when server response 200', async () => {
      const offerId = '1';
      const status = 1;
      const mockOffer = {
        ...makeFakeOffer(offerId),
        isFavorite: true,
      };

      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${offerId}/${status}`)
        .reply(200, mockOffer);

      await mockStore.dispatch(changeFavoriteStatusAction({
        offerId,
        status,
      }));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        changeFavoriteStatusAction.pending.type,
        fetchFavoriteOffersAction.pending.type,
        changeFavoriteStatusAction.fulfilled.type,
      ]);
    });

    it('should dispatch "changeFavoriteStatusAction.pending" and "changeFavoriteStatusAction.rejected" when server response 400', async () => {
      const offerId = '1';
      const status = 1;

      mockAxiosAdapter
        .onPost(`${APIRoute.Favorite}/${offerId}/${status}`)
        .reply(400);

      await mockStore.dispatch(changeFavoriteStatusAction({
        offerId,
        status,
      }));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        changeFavoriteStatusAction.pending.type,
        changeFavoriteStatusAction.rejected.type,
      ]);
    });
  });

  describe('checkAuthAction', () => {
    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.fulfilled" when server response 200', async () => {
      const mockUserData = makeFakeUserData();

      mockAxiosAdapter
        .onGet(APIRoute.Login)
        .reply(200, mockUserData);

      await mockStore.dispatch(checkAuthAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        fetchFavoriteOffersAction.pending.type,
        checkAuthAction.fulfilled.type,
      ]);
    });

    it('should dispatch "checkAuthAction.pending" and "checkAuthAction.rejected" when server response 400', async () => {
      mockAxiosAdapter
        .onGet(APIRoute.Login)
        .reply(400);

      await mockStore.dispatch(checkAuthAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        checkAuthAction.pending.type,
        checkAuthAction.rejected.type,
      ]);
    });
  });

  describe('loginAction', () => {
    it('should dispatch "loginAction.pending", "fetchOffersAction.pending", "fetchFavoriteOffersAction.pending" and "loginAction.fulfilled" when server response 200', async () => {
      const mockAuthData = makeFakeAuthData();
      const mockUserData = makeFakeUserData();

      mockAxiosAdapter
        .onPost(APIRoute.Login, mockAuthData)
        .reply(200, mockUserData);

      await mockStore.dispatch(loginAction(mockAuthData));

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        loginAction.pending.type,
        fetchOffersAction.pending.type,
        fetchFavoriteOffersAction.pending.type,
        loginAction.fulfilled.type,
      ]);
    });

    it('should call "saveToken" once with the received token', async () => {
      const mockAuthData = makeFakeAuthData();
      const mockUserData = makeFakeUserData();

      const mockSaveToken = vi.spyOn(tokenStorage, 'saveToken');

      mockAxiosAdapter
        .onPost(APIRoute.Login, mockAuthData)
        .reply(200, mockUserData);

      await mockStore.dispatch(loginAction(mockAuthData));

      expect(mockSaveToken).toHaveBeenCalledTimes(1);
      expect(mockSaveToken).toHaveBeenCalledWith(mockUserData.token);

      mockSaveToken.mockRestore();
    });
  });

  describe('logoutAction', () => {
    it('should dispatch "logoutAction.pending", "resetOffersFavoriteStatus" and "logoutAction.fulfilled" when server response 204', async () => {
      mockAxiosAdapter
        .onDelete(APIRoute.Logout)
        .reply(204);

      await mockStore.dispatch(logoutAction());

      const actions = extractActionsTypes(mockStore.getActions());

      expect(actions).toEqual([
        logoutAction.pending.type,
        resetOffersFavoriteStatus.type,
        logoutAction.fulfilled.type,
      ]);
    });

    it('should call "dropToken" once', async () => {
      const mockDropToken = vi.spyOn(tokenStorage, 'dropToken');

      mockAxiosAdapter
        .onDelete(APIRoute.Logout)
        .reply(204);

      await mockStore.dispatch(logoutAction());

      expect(mockDropToken).toHaveBeenCalledTimes(1);

      mockDropToken.mockRestore();
    });
  });
});

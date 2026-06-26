import { createAction } from '@reduxjs/toolkit';
import { Offer } from '../../types/offer';
import { AuthorizationStatus } from '../../const';

export const changeCity = createAction<string>('offers/changeCity');

export const fillOffers = createAction<Offer[]>('offers/fillOffers');

export const setOffersLoadingStatus = createAction<boolean>('offers/setOffersLoadingStatus');

export const requireAuthorization = createAction<AuthorizationStatus>('user/requireAuthorization');

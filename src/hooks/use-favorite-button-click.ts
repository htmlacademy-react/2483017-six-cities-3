import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../const';
import { changeFavoriteStatusAction } from '../store/api-actions';
import { useAppDispatch, useAppSelector } from './index';
import { selectAuthorizationStatus } from '../store/user-process';

export function useFavoriteButtonClick(offerId: string, isFavorite: boolean) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);

  return useCallback(() => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    dispatch(changeFavoriteStatusAction({
      offerId,
      status: isFavorite ? 0 : 1,
    }));
  }, [authorizationStatus, dispatch, isFavorite, navigate, offerId]);
}

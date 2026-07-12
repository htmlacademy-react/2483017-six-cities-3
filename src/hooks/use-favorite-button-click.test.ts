import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../const';
import { changeFavoriteStatusAction } from '../store/api-actions';
import { useAppDispatch, useAppSelector } from './index';
import { useFavoriteButtonClick } from './use-favorite-button-click';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('./index', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../store/api-actions', () => ({
  changeFavoriteStatusAction: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

const offerId = 'test-offer-id';

const renderFavoriteButtonHook = (isFavorite: boolean) =>
  renderHook(() => useFavoriteButtonClick(offerId, isFavorite));

describe('Hook: useFavoriteButtonClick', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
  });

  it('should redirect to login page when user is not authorized', () => {
    vi.mocked(useAppSelector).mockReturnValue(
      AuthorizationStatus.NoAuth
    );

    const { result } = renderFavoriteButtonHook(false);

    act(() => {
      result.current();
    });

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(changeFavoriteStatusAction).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should add offer to favorites when user is authorized', () => {
    vi.mocked(useAppSelector).mockReturnValue(
      AuthorizationStatus.Auth
    );

    const { result } = renderFavoriteButtonHook(false);

    act(() => {
      result.current();
    });

    expect(changeFavoriteStatusAction).toHaveBeenCalledWith({
      offerId,
      status: 1,
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should remove offer from favorites when user is authorized', () => {
    vi.mocked(useAppSelector).mockReturnValue(
      AuthorizationStatus.Auth
    );

    const { result } = renderFavoriteButtonHook(true);

    act(() => {
      result.current();
    });

    expect(changeFavoriteStatusAction).toHaveBeenCalledWith({
      offerId,
      status: 0,
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

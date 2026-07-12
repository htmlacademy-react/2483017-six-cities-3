import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDispatch, useSelector } from 'react-redux';
import type { State } from '../types/state';
import { useAppDispatch, useAppSelector } from './index';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

describe('Typed Redux hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dispatch from useDispatch', () => {
    const mockDispatch = vi.fn();

    vi.mocked(useDispatch).mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useAppDispatch());

    expect(useDispatch).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(mockDispatch);
  });

  it('should return selected state from useSelector', () => {
    const selectedValue = 'Paris';

    const selector = vi.fn<[State], string>()
      .mockReturnValue(selectedValue);

    vi.mocked(useSelector).mockReturnValue(selectedValue);

    const { result } = renderHook(() =>
      useAppSelector(selector)
    );

    expect(useSelector).toHaveBeenCalledTimes(1);
    expect(useSelector).toHaveBeenCalledWith(selector);
    expect(result.current).toBe(selectedValue);
  });
});

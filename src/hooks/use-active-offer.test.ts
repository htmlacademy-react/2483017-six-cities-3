import { act, renderHook } from '@testing-library/react';
import { useActiveOffer } from './use-active-offer';

describe('Hook: useActiveOffer', () => {
  it('should return array with 3 elements', () => {
    const { result } = renderHook(() => useActiveOffer());

    const [
      activeOfferId,
      handleCardMouseEnter,
      handleCardMouseLeave
    ] = result.current;

    expect(result.current).toHaveLength(3);
    expect(activeOfferId).toBeNull();
    expect(typeof handleCardMouseEnter).toBe('function');
    expect(typeof handleCardMouseLeave).toBe('function');
  });

  it('should correctly change state', () => {
    const { result } = renderHook(() => useActiveOffer());
    const offerId = 'test-offer-id';

    act(() => {
      result.current[1](offerId);
    });

    expect(result.current[0]).toBe(offerId);

    act(() => {
      result.current[2]();
    });

    expect(result.current[0]).toBeNull();
  });
});

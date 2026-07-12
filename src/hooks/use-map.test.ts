import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Map as LeafletMap, TileLayer } from 'leaflet';
import { makeFakeCity } from '../utils/mocks';
import useMap from './use-map';

vi.mock('leaflet', () => ({
  Map: vi.fn(),
  TileLayer: vi.fn(),
}));

const mockAddLayer = vi.fn();

const mockMap = {
  addLayer: mockAddLayer,
} as unknown as LeafletMap;

const mockTileLayer = {} as TileLayer;

const city = makeFakeCity();

describe('Hook: useMap', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(LeafletMap).mockReturnValue(mockMap);
    vi.mocked(TileLayer).mockReturnValue(mockTileLayer);
  });

  it('should return null when map element does not exist', () => {
    const mapRef = {
      current: null,
    };

    const { result } = renderHook(() => useMap(mapRef, city));

    expect(result.current).toBeNull();
    expect(LeafletMap).not.toHaveBeenCalled();
    expect(TileLayer).not.toHaveBeenCalled();
  });

  it('should create map with tile layer', () => {
    const mapElement = document.createElement('div');

    const mapRef = {
      current: mapElement,
    };

    const { result } = renderHook(() => useMap(mapRef, city));

    expect(LeafletMap).toHaveBeenCalledWith(mapElement, {
      center: {
        lat: city.location.latitude,
        lng: city.location.longitude,
      },
      zoom: city.location.zoom,
    });

    expect(TileLayer).toHaveBeenCalledWith(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    );

    expect(mockAddLayer).toHaveBeenCalledWith(mockTileLayer);

    expect(result.current).toBe(mockMap);
  });

  it('should create map only once after rerender', () => {
    const mapRef = {
      current: document.createElement('div'),
    };

    const { rerender } = renderHook(
      ({ currentCity }) => useMap(mapRef, currentCity),
      {
        initialProps: {
          currentCity: city,
        },
      }
    );

    rerender({
      currentCity: {
        ...city,
        location: {
          ...city.location,
          zoom: 15,
        },
      },
    });

    expect(LeafletMap).toHaveBeenCalledTimes(1);
    expect(TileLayer).toHaveBeenCalledTimes(1);
    expect(mockAddLayer).toHaveBeenCalledTimes(1);
  });
});

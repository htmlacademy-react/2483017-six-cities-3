import { render } from '@testing-library/react';
import {
  Marker,
  layerGroup,
  Map as LeafletMap,
  LayerGroup,
} from 'leaflet';
import useMap from '../../hooks/use-map';
import {
  makeFakeCity,
  makeFakeOffer,
} from '../../utils/mocks';
import Map from './map';

const {
  mockDefaultIcon,
  mockCurrentIcon,
} = vi.hoisted(() => ({
  mockDefaultIcon: {
    type: 'default-icon',
  },
  mockCurrentIcon: {
    type: 'current-icon',
  },
}));

vi.mock('../../hooks/use-map');

vi.mock('leaflet', () => ({
  Icon: vi
    .fn()
    .mockReturnValueOnce(mockDefaultIcon)
    .mockReturnValueOnce(mockCurrentIcon),

  Marker: vi.fn(),
  layerGroup: vi.fn(),
}));

const mockSetView = vi.fn();
const mockRemoveLayer = vi.fn();

const mockMap = {
  setView: mockSetView,
  removeLayer: mockRemoveLayer,
} as unknown as LeafletMap;

const mockMarkerAddTo = vi.fn();
const mockMarkerSetIcon = vi.fn();

const mockMarker = {
  setIcon: mockMarkerSetIcon,
  addTo: mockMarkerAddTo,
} as unknown as Marker;

const mockLayerGroupAddTo = vi.fn();

const mockMarkerLayer = {
  addTo: mockLayerGroupAddTo,
} as unknown as LayerGroup;

describe('Component: Map', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useMap).mockReturnValue(mockMap);
    vi.mocked(Marker).mockReturnValue(mockMarker);
    vi.mocked(layerGroup).mockReturnValue(mockMarkerLayer);

    mockMarkerSetIcon.mockReturnValue(mockMarker);
    mockMarkerAddTo.mockReturnValue(mockMarker);
    mockLayerGroupAddTo.mockReturnValue(mockMarkerLayer);
  });

  it('should render map container with default class', () => {
    const city = makeFakeCity();

    const { container } = render(
      <Map
        city={city}
        offers={[]}
        selectedOffer={undefined}
      />,
    );

    expect(
      container.querySelector('section'),
    ).toHaveClass('cities__map', 'map');
  });

  it('should render map container with custom class', () => {
    const city = makeFakeCity();

    const { container } = render(
      <Map
        city={city}
        offers={[]}
        selectedOffer={undefined}
        className="offer__map map"
      />,
    );

    expect(
      container.querySelector('section'),
    ).toHaveClass('offer__map', 'map');
  });

  it('should create marker for each offer', () => {
    const city = makeFakeCity();

    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
      makeFakeOffer('3'),
    ];

    render(
      <Map
        city={city}
        offers={mockOffers}
        selectedOffer={undefined}
      />,
    );

    expect(Marker).toHaveBeenCalledTimes(
      mockOffers.length,
    );

    mockOffers.forEach((offer) => {
      expect(Marker).toHaveBeenCalledWith({
        lat: offer.location.latitude,
        lng: offer.location.longitude,
      });
    });

    expect(mockMarkerSetIcon)
      .toHaveBeenCalledTimes(mockOffers.length);

    expect(mockMarkerAddTo)
      .toHaveBeenCalledTimes(mockOffers.length);
  });

  it('should use current icon for selected offer', () => {
    const city = makeFakeCity();

    const mockOffers = [
      makeFakeOffer('1'),
      makeFakeOffer('2'),
    ];

    render(
      <Map
        city={city}
        offers={mockOffers}
        selectedOffer={mockOffers[1]}
      />,
    );

    expect(mockMarkerSetIcon).toHaveBeenNthCalledWith(
      1,
      mockDefaultIcon,
    );

    expect(mockMarkerSetIcon).toHaveBeenNthCalledWith(
      2,
      mockCurrentIcon,
    );
  });

  it('should set map view using city location', () => {
    const city = makeFakeCity();

    render(
      <Map
        city={city}
        offers={[]}
        selectedOffer={undefined}
      />,
    );

    expect(mockSetView).toHaveBeenCalledWith(
      {
        lat: city.location.latitude,
        lng: city.location.longitude,
      },
      city.location.zoom,
    );
  });

  it('should remove marker layer when component unmounts', () => {
    const city = makeFakeCity();

    const { unmount } = render(
      <Map
        city={city}
        offers={[makeFakeOffer()]}
        selectedOffer={undefined}
      />,
    );

    unmount();

    expect(mockRemoveLayer)
      .toHaveBeenCalledWith(mockMarkerLayer);
  });
});

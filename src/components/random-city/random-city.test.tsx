import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRoute, CITIES } from '../../const';
import {
  useAppDispatch,
} from '../../hooks';
import { changeCity } from '../../store/app-process';
import { withHistory } from '../../utils/mock-component';
import RandomCity from './random-city';

vi.mock('../../hooks', () => ({
  useAppDispatch: vi.fn(),
}));

describe('Component: RandomCity', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppDispatch).mockReturnValue(
      mockDispatch,
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render a city selected from CITIES', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    render(
      withHistory(<RandomCity />),
    );

    expect(
      screen.getByRole('link', {
        name: CITIES[0],
      }),
    ).toBeInTheDocument();
  });

  it('should render link to main page', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    render(
      withHistory(<RandomCity />),
    );

    expect(
      screen.getByRole('link', {
        name: CITIES[0],
      }),
    ).toHaveAttribute(
      'href',
      AppRoute.Main,
    );
  });

  it('should dispatch "changeCity" with displayed city when user clicks the link', async () => {
    const user = userEvent.setup();

    vi.spyOn(Math, 'random').mockReturnValue(0);

    render(
      withHistory(<RandomCity />),
    );

    await user.click(
      screen.getByRole('link', {
        name: CITIES[0],
      }),
    );

    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith(
      changeCity(CITIES[0]),
    );
  });
});

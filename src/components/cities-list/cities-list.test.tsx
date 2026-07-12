import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CITIES, NameSpace } from '../../const';
import { changeCity } from '../../store/app-process';
import { withStore } from '../../utils/mock-component';
import { makeFakeStore } from '../../utils/mocks';
import CitiesList from './cities-list';

describe('Component: CitiesList', () => {
  it('should render all cities', () => {
    const { withStoreComponent } = withStore(
      <CitiesList />,
      makeFakeStore(),
    );

    render(withStoreComponent);

    CITIES.forEach((city) => {
      expect(
        screen.getByRole('button', { name: city }),
      ).toBeInTheDocument();
    });
  });

  it('should mark current city as active', () => {
    const activeCity = CITIES[0];

    const { withStoreComponent } = withStore(
      <CitiesList />,
      makeFakeStore({
        [NameSpace.App]: {
          city: activeCity,
        },
      }),
    );

    render(withStoreComponent);

    expect(
      screen.getByRole('button', { name: activeCity }),
    ).toHaveClass('tabs__item--active');
  });

  it('should dispatch "changeCity" when user clicks another city', async () => {
    const user = userEvent.setup();
    const activeCity = CITIES[0];
    const selectedCity = CITIES[1];

    const { withStoreComponent, mockStore } = withStore(
      <CitiesList />,
      makeFakeStore({
        [NameSpace.App]: {
          city: activeCity,
        },
      }),
    );

    render(withStoreComponent);

    await user.click(
      screen.getByRole('button', { name: selectedCity }),
    );

    expect(mockStore.getActions()).toEqual([
      changeCity(selectedCity),
    ]);
  });
});

import { CITIES, NameSpace } from '../../const';
import { makeFakeStore } from '../../utils/mocks';
import { selectCity } from './app-process.selectors';

describe('App process selectors', () => {
  it('should return city from state', () => {
    const mockCity = CITIES[1];

    const state = makeFakeStore({
      [NameSpace.App]: {
        city: mockCity,
      },
    });

    const result = selectCity(state);

    expect(result).toBe(mockCity);
  });
});

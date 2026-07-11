import { appProcess, changeCity } from './index';
import { CITIES } from '../../const';

describe('AppProcess Slice', () => {
  it('should return initial state with default city when passed empty action and undefined state', () => {
    const emptyAction = { type: '' };

    const expectedState = {
      city: CITIES[0],
    };

    const result = appProcess.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return current state when passed empty action', () => {
    const currentState = {
      city: CITIES[1],
    };

    const emptyAction = { type: '' };

    const result = appProcess.reducer(currentState, emptyAction);

    expect(result).toEqual(currentState);
  });

  it('should change city with "changeCity" action', () => {
    const initialState = {
      city: CITIES[0],
    };

    const expectedState = {
      city: CITIES[3],
    };

    const result = appProcess.reducer(initialState, changeCity(CITIES[3]));

    expect(result).toEqual(expectedState);
  });
});

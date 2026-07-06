import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const selectCity = (state: State) => state[NameSpace.App].city;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CITIES, NameSpace } from '../../const';

type AppProcess = {
  city: string;
};

const initialState: AppProcess = {
  city: CITIES[0],
};

export const appProcess = createSlice({
  name: NameSpace.App,
  initialState,
  reducers: {
    changeCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
});

export const { changeCity } = appProcess.actions;

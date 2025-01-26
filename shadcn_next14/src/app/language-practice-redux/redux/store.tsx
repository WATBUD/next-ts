import { configureStore } from '@reduxjs/toolkit';
import optionsReducer from './options_reducer';

const store = configureStore({
  reducer: {
    options: optionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

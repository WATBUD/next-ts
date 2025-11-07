// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import optionsReducer from '@/app/language-practice-redux/redux/options-reducer';

export const store = configureStore({
  reducer: {
    options: optionsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', // 只在非 production 環境開啟 DevTools
});

// TypeScript 型別定義
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 型別安全的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;

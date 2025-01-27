/* eslint-disable react-hooks/exhaustive-deps */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store'; 
import { showCustomToast,downloadJSONFile } from '../../common/shared_function';
import language_data_sheet from "../language_data_sheet.json";

export interface OptionsState {
  showOptionUI: boolean;
  databaseHasBeenLoaded: boolean;
  configOptions: {
    copyTheTextBelow: boolean;
    copyTheTextAbove: boolean;
    showFavoritesListOnly: boolean;
    selectedLanguages: string[];
  };
  favorites: number[];
  queryString: string;
  filteredQueryData: any[];
  languageDataSheet: any[];
}
const filteredLanguageDataSheet = language_data_sheet.map((entry) => {
  // const filteredTranslations = Object.fromEntries(
  //   Object.entries(entry.translations).filter(([lang]) => ['en', 'zh'].includes(lang))
  // );
  // return { ...entry, translations: filteredTranslations };

  // Filter translations to only include 'en' and 'zh'
  const filteredTranslations = {
    en: entry.translations.en,
    zh: entry.translations.zh,
  };
  return { ...entry, translations: filteredTranslations }; // Return the updated entry with filtered translations
});

const initialState: OptionsState = {
  showOptionUI: false,
  databaseHasBeenLoaded: false,
  configOptions: {
    copyTheTextBelow: true,
    copyTheTextAbove: true,
    showFavoritesListOnly: false,
    selectedLanguages: ["en", "zh"],
  },
  favorites: [],
  queryString: '',
  filteredQueryData: [],
  languageDataSheet: filteredLanguageDataSheet 
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    resetState(state) {
      // Reset all fields except showOptionUI
      //state.databaseHasBeenLoaded = false;
      state.configOptions = initialState.configOptions; // Resets to the initial config options
      state.favorites = [];
      state.queryString = "";
      state.filteredQueryData = [];
    },
    initializeConfigOptions(
      state,
      action: PayloadAction<Partial<OptionsState["configOptions"]>>
    ) {
      if (action.payload) {
        if (typeof action.payload.copyTheTextBelow === "boolean") {
          state.configOptions.copyTheTextBelow =
            action.payload.copyTheTextBelow;
        }
        if (typeof action.payload.copyTheTextAbove === "boolean") {
          state.configOptions.copyTheTextAbove =
            action.payload.copyTheTextAbove;
        }
        if (typeof action.payload.showFavoritesListOnly === "boolean") {
          state.configOptions.showFavoritesListOnly =
            action.payload.showFavoritesListOnly;
        }
        if (Array.isArray(action.payload.selectedLanguages)) {
          state.configOptions.selectedLanguages =
            action.payload.selectedLanguages;
        }
      }
      state.databaseHasBeenLoaded = true;

    },
    setShowOptionUI(state, action: PayloadAction<boolean>) {
      state.showOptionUI = action.payload;
    },
    setDbHasBeenLoaded(state, action: PayloadAction<boolean>) {
      state.databaseHasBeenLoaded = action.payload;
    },
    batchUpdateConfigOptions(
      state,
      action: PayloadAction<Partial<OptionsState["configOptions"]>>
    ) {
      Object.entries(action.payload).forEach(([key, value]) => {
        (state.configOptions as any)[key] = value;
      });
    },
    setConfigOptions(
      state,
      action: PayloadAction<OptionsState["configOptions"]>
    ) {
      state.configOptions = action.payload;
    },
    updateConfigOptions(
      state,
      action: PayloadAction<
        (
          prevOptions: OptionsState["configOptions"]
        ) => OptionsState["configOptions"]
      >
    ) {
      state.configOptions = action.payload(state.configOptions);
    },
    setFavorites(state, action: PayloadAction<number[]>) {
      state.favorites = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.queryString = action.payload;
    },
    handleShowMode: (state) => {
      //const { showFavoritesListOnly} = action.payload;
      console.log(
        "%c handleShowMode",
        "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
        "state:",
        JSON.parse(JSON.stringify(state))
      );

      if (state.databaseHasBeenLoaded) {
        showCustomToast(
          state.configOptions.showFavoritesListOnly ? "最愛模式" : "全部模式"
        );

        optionsSlice.caseReducers.applyFilter(state);
      }
    },
    handleInputChange: (state, action: PayloadAction<string>) => {
      console.log(
        "%c handleInputChange",
        "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
        "action:",
        action
      );
      state.queryString = action.payload;
      optionsSlice.caseReducers.applyFilter(state);
    },
    applyFilter: (state) => {
      const inputQueryString = state.queryString.trim();
      // console.log(
      //   "%c mergedData",
      //   "color:#DDDD00;font-family:system-ui;font-size:2rem;font-weight:bold",
      //   mergedData
      // );
      // downloadJSONFile("test",mergedData);

      const filtered = filteredLanguageDataSheet.filter((item) => {
        if (inputQueryString.length === 0) {
          return state.configOptions.showFavoritesListOnly
            ? state.favorites.includes(item.index)
            : true;
        }

        return (
          Object.values(item.translations).some((translation: string) =>
            translation.toLowerCase().includes(inputQueryString.toLowerCase())
          ) &&
          (!state.configOptions.showFavoritesListOnly ||
            state.favorites.includes(item.index))
        );
      });

      console.log(
        "%c languagePracticeTool_filtered",
        "color:#DDDD00;font-family:system-ui;font-size:2rem;font-weight:bold",
        "filtered:",
        filtered
      );

      state.filteredQueryData = filtered;

      if (filtered.length <= 0 && state.configOptions.showFavoritesListOnly) {
        showCustomToast("最愛模式:無收藏名單");
      }
    },
    toggleStarred: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const favorites = state.favorites;

      if (favorites.includes(index)) {
        state.favorites = favorites.filter((fav) => fav !== index);
        showCustomToast("已移除最愛");
      } else {
        state.favorites.push(index);
        showCustomToast("已添加至最愛");
      }
    },
  },
});

export const { resetState,initializeConfigOptions,setShowOptionUI, setDbHasBeenLoaded, setConfigOptions, updateConfigOptions, setFavorites, handleShowMode, handleInputChange, toggleStarred, setQuery } = optionsSlice.actions;

export default optionsSlice.reducer;



type OptionsActions = {
  [Key in keyof typeof optionsSlice.actions]: (
    payload: Parameters<(typeof optionsSlice.actions)[Key]>[0]
  ) => void;
};
export const useOptions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const statesValue = useSelector((state: RootState) => state.options);
  const actions: OptionsActions = Object.keys(optionsSlice.actions).reduce(
    (accumulator, actionName) => {
      accumulator[actionName as keyof OptionsActions] = (payload) =>
        dispatch((optionsSlice.actions as any)[actionName](payload));
      return accumulator;
    },
    {} as OptionsActions
  );
  return {
    ...statesValue,
    ...actions,
  };
};

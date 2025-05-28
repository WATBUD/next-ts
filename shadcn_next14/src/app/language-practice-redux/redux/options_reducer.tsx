/* eslint-disable react-hooks/exhaustive-deps */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './store'; 
import { showCustomToast,downloadJSONFile } from '../../common/shared_function';
import language_data_sheet from "../language_data_sheet.json";

const filteredLanguageDataSheet = (languages:string[]) => {
  return language_data_sheet.map((entry:any) => {
    // Filter translations to only include the specified languages
    const filteredTranslations = {
      [languages[0]]: entry.translations[languages[0]],
      [languages[1]]: entry.translations[languages[1]],
    };
    return { ...entry, translations: filteredTranslations }; // Return the updated entry with filtered translations
  });
    // const filteredTranslations = Object.fromEntries(
  //   Object.entries(entry.translations).filter(([lang]) => ['en', 'zh'].includes(lang))
  // );
  // return { ...entry, translations: filteredTranslations };
};
export interface OptionsState {
  showOptionUI: boolean;
  databaseHasBeenLoaded: boolean;
  configOptions: {
    copyTheTextBelow: boolean;
    copyTheTextAbove: boolean;
    showFavoritesListOnly: boolean;
    selectedLanguages: string[];
    voiceTranslationSpeed: number;
    voiceTranslationVolume: number;
  };
  favorites: number[];
  queryString: string;
  filteredQueryData: any[];
  languageDataSheet: any[];
  selectedTags: string[];
}
const initialState: OptionsState = {
  showOptionUI: false,
  databaseHasBeenLoaded: false,
  configOptions: {
    copyTheTextBelow: true,
    copyTheTextAbove: true,
    showFavoritesListOnly: false,
    selectedLanguages: ["zh","en"],
    voiceTranslationSpeed: 1,
    voiceTranslationVolume: 1,
  },
  favorites: [],
  queryString: '',
  filteredQueryData: [],
  languageDataSheet: filteredLanguageDataSheet(["zh","en"]),
  selectedTags: [],
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
        const actionPayload = action.payload;
        const keysToUpdate: (keyof OptionsState["configOptions"])[] = [
          'copyTheTextBelow',
          'copyTheTextAbove',
          'showFavoritesListOnly',
          'voiceTranslationVolume',
          'voiceTranslationSpeed',
        ];
    
        keysToUpdate.forEach((key) => {
          if (key in actionPayload && actionPayload[key] !== undefined) {
            // Use type assertion to tell TypeScript these types are compatible
            (state.configOptions[key] as typeof actionPayload[typeof key]) = actionPayload[key]!;
          }
        });
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
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload;
    },
    applyFilter: (state) => {
      const inputQueryString = state.queryString.trim();

      const filtered = state.languageDataSheet.filter((item) => {
        // Check if item matches selected tags
        const matchesTags = state.selectedTags.length === 0 || 
          (item.tag && state.selectedTags.includes(item.tag));

        if (inputQueryString.length === 0) {
          return matchesTags && (state.configOptions.showFavoritesListOnly
            ? state.favorites.includes(item.index)
            : true);
        }

        return (
          Object.values(item.translations).some((translation: any) =>
            translation.toLowerCase().includes(inputQueryString.toLowerCase())
          ) &&
          matchesTags &&
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

export const { 
  resetState,
  initializeConfigOptions,
  setShowOptionUI, 
  setDbHasBeenLoaded, 
  setConfigOptions, 
  updateConfigOptions, 
  setFavorites, 
  handleShowMode, 
  handleInputChange, 
  toggleStarred, 
  setQuery,
  setSelectedTags,
  applyFilter 
} = optionsSlice.actions;

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

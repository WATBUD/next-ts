/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
//import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
//import { DocumentDuplicateIcon as DocumentDuplicateIconOutline } from '@heroicons/react/24/outline'


import { 
DocumentDuplicateIcon as DocumentDuplicateIconSolid,
SpeakerWaveIcon,
ChevronDoubleUpIcon,
Cog6ToothIcon,
FunnelIcon
} from "@heroicons/react/24/solid";
import React, { useState, useEffect, useRef, useContext } from "react";
import toast, {
  Renderable,
  Toast,
  Toaster,
  ValueFunction,
} from "react-hot-toast";
import OptionsModal from "./OptionsModal";
import { useOptions } from "../redux/options-reducer";
import { theme } from "../../common/theme";
import { ThemeDiv } from "../../common/ThemeDiv";

import { copyText,useIsMobile,translateTextAndSpeak,highlightText,scrollToTop,handleScroll } from '../../common/shared-function';
import { set_indexedDB_Data, get_indexedDB_data } from "../../common/indexedDB-utils";
import { useDispatch, useSelector } from "react-redux";
import FilterModal from "./FilterModal";
import { RootState, AppDispatch } from "../redux/store";
import { setSelectedTags, applyFilter, setQuery } from "../redux/options-reducer";

const SearchList: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    showOptionUI,
    databaseHasBeenLoaded,
    handleInputChange,
    initializeConfigOptions,
    handleShowMode,
    toggleStarred,
    configOptions,
    favorites,
    setFavorites,
    setDbHasBeenLoaded,
    setShowOptionUI,
    filteredQueryData: filteredData,
    queryString,

  } = useOptions();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const selectedTags = useSelector((state: RootState) => state.options.selectedTags);
  const dispatch = useDispatch<AppDispatch>();


  useEffect(() => {
    console.log(
      "%c SearchList+useEffect+configOptions",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
      'configOptions',
      configOptions
    );
    if (databaseHasBeenLoaded) {
      set_indexedDB_Data("favorites", "configOptions", configOptions, () => {});
    }
  }, [configOptions]);

  useEffect(() => {
    handleShowMode();
  }, [configOptions.showFavoritesListOnly]);

  useEffect(() => {
    console.log(
      "%c useEffect+optionsState.favorites",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold"
    );
    if (databaseHasBeenLoaded) {
      set_indexedDB_Data("favorites", "data", favorites, () => {});
    } 
  }, [favorites]);

  useEffect(() => {
    if(!databaseHasBeenLoaded){
      Promise.all([
        get_indexedDB_data("favorites", "configOptions"),
        get_indexedDB_data("favorites", "data")
      ])
      .then(([prevConfigOptions, favoritesData]) => {
        if (prevConfigOptions !== undefined) {
          console.log("indexedDB configOptions:", prevConfigOptions);
          initializeConfigOptions(prevConfigOptions);

        }
        
        if (favoritesData !== undefined) {
          console.log("indexedDB favoritesData:", favoritesData);
          setFavorites(favoritesData);
        }
        setDbHasBeenLoaded(true);
      })
      .catch((error) => {
        console.error((error as Error).message);
      });
    }
    handleScroll();
  }, []);




  return (
    <div className="h-[100vh] max-w-[680px] mx-auto w-full relative overflow-hidden overflow-y-auto">
      <OptionsModal />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedTags={selectedTags}
        onTagsChange={(tags: string[]) => {
          dispatch(setSelectedTags(tags));
          dispatch(applyFilter());
        }}
      />
      <Toaster />
      <div
        id="MainScreenUI"
        className="flex flex-col h-full w-full relative overflow-y-auto"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE and Edge */,
        }}
      >
        <style jsx>{`
          #MainScreenUI::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        `}</style>
        <div 
          className="sticky top-0 z-10 backdrop-blur-[1.5px] rounded-[10px]"
        >
          <div className="flex items-center justify-between p-4">
            <ThemeDiv type="text" className="self-center text-2xl font-bold">
              Sentence Search
            </ThemeDiv>

            <div className="flex gap-2">
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <FunnelIcon
                  className="h-6 w-6 fill-current"
                  style={{ color: theme.colors.icon.primary }}
                />
              </button>
              <button
                onClick={() => {
                  setShowOptionUI(true);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 fill-current"
                  style={{ color: theme.colors.icon.primary }}
                />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 pb-4">
            <input
              type="text"
              value={queryString}
              onChange={(e) => {
                dispatch(setQuery(e.target.value));
                dispatch(applyFilter());
              }}
              placeholder="Search..."
              className="w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              style={{
                borderColor: theme.colors.border.medium,
                color: theme.colors.text.primary,
                backgroundColor: "#ffffff",
              }}
            />
          </div>
        </div>
        <div className="px-4 relative">
          {queryString != null && (
            <ul className="flex flex-col mt-2 w-full">
              <button
                id="scrollToTopButton"
                onClick={scrollToTop}
                className="absolute right-4 hidden items-center rounded-md px-3 py-2 shadow-sm bg-blue-500/30 hover:bg-blue-500/40 text-white transition-colors"
                style={{
                  bottom: isMobile ? "10vh" : "10vh",
                }}
              >
                <ChevronDoubleUpIcon
                  className="h-6 w-6 fill-current mr-2"
                  style={{ color: theme.colors.icon.primary }}
                />
                Top
              </button>
              {filteredData.map((item) => (
                <li
                  key={item.index}
                  className="flex w-full items-center border-b py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  style={{ borderColor: theme.colors.border.medium }}
                >
                  <button
                    className="mr-5 hover:opacity-80 transition-opacity"
                    onClick={() => toggleStarred(item.index)}
                  >
                    <StarIconOutline
                      className={`size-6 ${
                        favorites.includes(item.index)
                          ? "fill-current text-yellow-400"
                          : "stroke-current"
                      }`}
                      style={{
                        color: favorites.includes(item.index)
                          ? "#fbbf24"
                          : theme.colors.icon.primary,
                      }}
                    />
                  </button>
                  <div className="break-words flex-grow">
                    <ThemeDiv type="text">
                      {highlightText(
                        item.translations[configOptions.selectedLanguages[0]],
                        queryString
                      )}
                    </ThemeDiv>
                    <ThemeDiv type="text">
                      {highlightText(
                        item.translations[configOptions.selectedLanguages[1]],
                        queryString
                      )}
                    </ThemeDiv>
                  </div>
                  <div className="flex justify-end flex-grow gap-2">
                    <button
                      className="hover:opacity-80 transition-opacity"
                      onClick={() => {
                        translateTextAndSpeak(
                          item.translations[configOptions.selectedLanguages[1]],
                          configOptions.voiceTranslationSpeed,
                          configOptions.voiceTranslationVolume
                        );
                      }}
                    >
                      <SpeakerWaveIcon
                        className="h-6 w-6 fill-current"
                        style={{ color: theme.colors.icon.primary }}
                      />
                    </button>
                    <button
                      className="hover:opacity-80 transition-opacity"
                      onClick={() => {
                        copyText(
                          item.translations[configOptions.selectedLanguages[0]],
                          item.translations[configOptions.selectedLanguages[1]],
                          configOptions
                        );
                      }}
                    >
                      <DocumentDuplicateIconSolid
                        className="h-6 w-6 fill-current"
                        style={{ color: theme.colors.icon.primary }}
                      />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchList;

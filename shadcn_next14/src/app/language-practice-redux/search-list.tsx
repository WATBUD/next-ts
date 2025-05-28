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
import OptionsModal from "./options-modal";
import { useOptions } from "./redux/options-reducer";
import { theme } from "../common/theme";
import { ThemeDiv } from "../common/ThemeDiv";

import { copyText,useIsMobile,translateTextAndSpeak,highlightText,scrollToTop,handleScroll } from '../common/shared-function';
import { set_indexedDB_Data, get_indexedDB_data } from "../common/indexedDB-utils";
import './language-component.css'; 
import { useDispatch, useSelector } from "react-redux";
import FilterModal from "./components/FilterModal";
import { RootState, AppDispatch } from "./redux/store";
import { setSelectedTags, applyFilter, setQuery } from "./redux/options-reducer";

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

  const handleTagsChange = (tags: string[]) => {
    dispatch(setSelectedTags(tags));
    dispatch(applyFilter());
  };

  useEffect(() => {
    console.log(
      "%c search-list+useEffect+configOptions",
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
    <div className="flex flex-col h-full max-w-[980px] mx-auto w-full">
      <div className="flex items-center justify-between p-4">
        <ThemeDiv type="text" className="self-center text-2xl font-bold">
              Sentence Search
            </ThemeDiv>

        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
          >
            <Cog6ToothIcon
              className="h-6 w-6 fill-current"
              style={{ color: theme.colors.icon.primary }}
            />
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between pl-4 pr-4">
          <input
            type="text"
            value={queryString}
            onChange={(e) => {
              dispatch(setQuery(e.target.value));
              dispatch(applyFilter());
            }}
            placeholder="Search..."
            className="w-full rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            style={{
              borderColor: theme.colors.border.medium,
              color: theme.colors.text.primary,
              backgroundColor: "#ffffff",
            }}
          />
        </div>
      <div className="px-4">
        {queryString != null && (
          <ul className="flex flex-col mt-2 bg-[#0000] w-full">
            <button
              id="scrollToTopButton"
              onClick={scrollToTop}
              className="fixed self-end hidden rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              style={{
                backgroundColor: "rgba(45, 114, 210,0.3)",
                bottom: isMobile ? "10vh" : "10vh",
                color: "#ffffff",
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
                className="flex w-full items-center border-b py-2"
                style={{ borderColor: theme.colors.border.medium }}
              >
                <button
                  className="mr-5 bg-[#0000]"
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
                <div className="break-word flex-grow-[1] bg-[#0000]">
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
                <div className="flex justify-end flex-grow-[1]">
                  <button
                    className=""
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
                    className="ml-2"
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
      <OptionsModal />
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedTags={selectedTags}
        onTagsChange={handleTagsChange}
      />
      <Toaster />
    </div>
  );
};

export default SearchList;

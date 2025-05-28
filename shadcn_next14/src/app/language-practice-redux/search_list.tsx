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
import OptionsModal from "./options_modal";
import { useOptions } from "./redux/options_reducer";
import { theme } from "../common/theme";
import { ThemeDiv } from "../common/ThemeDiv";

import { copyText,useIsMobile,translateTextAndSpeak,highlightText,scrollToTop,handleScroll } from '../common/shared_function';
import { set_indexedDB_Data, get_indexedDB_data } from "../common/indexedDB_utils";
import './language_component.css'; 
import { useDispatch } from "react-redux";
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

  useEffect(() => {
    console.log(
      "%c search_list+useEffect+configOptions",
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
    <div className="w-full flex flex-col items-center mr-5">
      <div
        id="MainScreenUI"
        className={`flex flex-col items-center bg-transparent${
          !showOptionUI ? " show" : ""
        }`}
      >
        <div
          id="navbar"
          className="max-w-[980px] w-[86%] mb-2 flex flex-col sticky top-0 z-2 rounded-lg py-2"
          style={{
            background: theme.colors.background.transparent,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div className="mb-2 mt-3 flex w-full items-center justify-between">
            <ThemeDiv type="text" className="self-center text-2xl font-bold">
              Sentence Search
            </ThemeDiv>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowOptionUI(true);
                }}
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
          <div className="flex w-full">
            <input
              type="text"
              placeholder="Search..."
              value={queryString}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-[100%] rounded-md border px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              style={{
                borderColor: theme.colors.border.medium,
                color: theme.colors.text.primary,
                backgroundColor: "#ffffff",
              }}
            />
          </div>
        </div>
        <div className="max-w-[980px] w-[86%] flex flex-col items-center">
          {queryString != null && (
            <ul className="flex flex-col mt-2 bg-[#0000] w-[100%]">
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
                  className="flex w-[100%] items-center border-b py-2"
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
      </div>
      <OptionsModal />
      <Toaster />
    </div>
  );
};

export default SearchList;

import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { showCustomToast } from "../common/sharedFunction";
import './options-css.css';

import { useOptions } from "./redux/optionsReducer";
import LanguageSelector from "./languageSelector"; // 引入新的組件

const OptionsModal = () => {
  const {
    showOptionUI,
    configOptions,
    resetState,
    setShowOptionUI,
    setConfigOptions,
    setFavorites,
  } = useOptions();

  return (
    <div className={`OptionsModal${showOptionUI ? " show" : ""}`}>
      
      <div className="bg-[#fffdfdde] max-w-[500px] w-[100%] h-[100%] rounded-lg shadow-lg p-4 flex flex-col items-center">
        <div className="flex items-center mb-10 bg-[#0000] w-[100%]">
          <button
            className="bg-[#0000]"
            onClick={() => {
              console.log(
                "%c optionsModal+onClick",
                "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
                showOptionUI
              );
              setShowOptionUI(!showOptionUI);
            }}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold flex-grow ml-3">Options</h1>
        </div>
        <LanguageSelector />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="showFavorites"
            checked={configOptions.showFavoritesListOnly}
            onChange={() =>
              setConfigOptions({
                ...configOptions,
                showFavoritesListOnly: !configOptions.showFavoritesListOnly,
              })
            }
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="showFavorites" className="text-lg">
            Show Favorites Only
          </label>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="copyTheTextAbove"
            checked={configOptions.copyTheTextAbove}
            onChange={() => {
              setConfigOptions({
                ...configOptions,
                copyTheTextAbove: !configOptions.copyTheTextAbove,
              });
            }}
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="copyTheTextAbove" className="text-lg">
            Copy the text above{' '}
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="copyTheTextAbove"
            checked={configOptions.copyTheTextBelow}
            onChange={() => {
              setConfigOptions({
                ...configOptions,
                copyTheTextBelow: !configOptions.copyTheTextBelow,
              });
            }}
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="setCopyTheTextBelow" className="text-lg">
            Copy the text below{' '}
          </label>
        </div>

        <div className="flex justify-end">
          <button
            className="options-btn"
            onClick={() => {
              setFavorites([]);
              showCustomToast("Clear my favorites");
            }}
          >
            Clear my favorites
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="options-btn"
            onClick={() => {
              resetState();
            }}
          >
            Factory Reset
          </button>
        </div>
        <div className="flex justify-end">
          <button
            className="options-btn"
            onClick={() => {
              setShowOptionUI(!showOptionUI);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;

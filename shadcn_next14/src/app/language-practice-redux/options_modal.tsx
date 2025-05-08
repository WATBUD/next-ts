import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { showCustomToast } from "../common/shared_function";
import "./options_css.css";

import { useOptions } from "./redux/options_reducer";
import LanguageSelector from "./language_selector"; // 引入新的組件

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
            Copy the text above{" "}
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="copyTheTextBelow"
            checked={configOptions.copyTheTextBelow}
            onChange={() => {
              console.log(
                "%c configOptions.copyTheTextBelow+onChange",
                "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
                !configOptions.copyTheTextBelow
              );
              setConfigOptions({
                ...configOptions,
                copyTheTextBelow: !configOptions.copyTheTextBelow,
              });
            }}
            className="mr-2 w-5 h-5"
          />
          <label htmlFor="setCopyTheTextBelow" className="text-lg">
            Copy the text below
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
        <label className="text-lg pt-5">
          Voice Speed:{configOptions.voiceTranslationSpeed}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          id="rate"
          value={configOptions.voiceTranslationSpeed}
          onChange={(e) => {
            setConfigOptions({
              ...configOptions,
              voiceTranslationSpeed: parseFloat(e.target.value), // Update with the new value
            });
          }}
          className="mr-2 w-[50%] h-5 py-5"
        />
        <label className="text-lg pt-5">
          Voice Volume:{configOptions.voiceTranslationVolume}
        </label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          id="rate"
          value={configOptions.voiceTranslationVolume}
          onChange={(e) => {
            setConfigOptions({
              ...configOptions,
              voiceTranslationVolume: parseFloat(e.target.value), // Update with the new value
            });
          }}
          className="mr-2 w-[50%] h-5 py-5"
        />


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

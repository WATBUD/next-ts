import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import {
  UserCircleIcon,
  LanguageIcon,
  StarIcon,
  DocumentDuplicateIcon,
  SpeakerWaveIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { showCustomToast } from "../common/shared_function";
import "./options_css.css";

import { useOptions } from "./redux/options_reducer";
import LanguageSelector from "./language_selector";

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
      <div className="h-full flex flex-col bg-[#f5f5f5]">
        {/* Header */}
        <div className="bg-white p-4 flex items-center border-b sticky top-0 z-10">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setShowOptionUI(!showOptionUI)}
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex-grow ml-3">Settings</h1>
        </div>

        {/* Profile Section */}
        {/* <div className="profile-section">
          <div className="profile-avatar">
            <UserCircleIcon className="w-full h-full text-gray-400" />
          </div>
          <div className="profile-info">
            <div className="profile-name">User Profile</div>
            <div className="profile-status">Language Learning</div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[81.5%]">
          {/* Language Section */}
          <div className="settings-section">
            <div className="section-title">Language</div>
            <LanguageSelector />
          </div>

          {/* Display Settings */}
          <div className="settings-section">
            <div className="section-title">Display</div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() =>
                setConfigOptions({
                  ...configOptions,
                  showFavoritesListOnly: !configOptions.showFavoritesListOnly,
                })
              }
            >
              <StarIcon className="settings-icon" />
              <div className="settings-label">Show Favorites Only</div>
              <input
                type="checkbox"
                checked={configOptions.showFavoritesListOnly}
                onChange={(e) => e.stopPropagation()}
                className="ml-auto"
              />
            </div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() =>
                setConfigOptions({
                  ...configOptions,
                  copyTheTextAbove: !configOptions.copyTheTextAbove,
                })
              }
            >
              <DocumentDuplicateIcon className="settings-icon" />
              <div className="settings-label">Copy Text Above</div>
              <input
                type="checkbox"
                checked={configOptions.copyTheTextAbove}
                onChange={(e) => e.stopPropagation()}
                className="ml-auto"
              />
            </div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() =>
                setConfigOptions({
                  ...configOptions,
                  copyTheTextBelow: !configOptions.copyTheTextBelow,
                })
              }
            >
              <DocumentDuplicateIcon className="settings-icon" />
              <div className="settings-label">Copy Text Below</div>
              <input
                type="checkbox"
                checked={configOptions.copyTheTextBelow}
                onChange={(e) => e.stopPropagation()}
                className="ml-auto"
              />
            </div>
          </div>

          {/* Voice Settings */}
          <div className="settings-section">
            <div className="section-title">Voice</div>
            <div className="settings-item">
              <SpeakerWaveIcon className="settings-icon" />
              <div className="settings-label">Voice Speed</div>
              <div className="settings-value">{configOptions.voiceTranslationSpeed.toFixed(1)}x</div>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={configOptions.voiceTranslationSpeed}
                onChange={(e) => {
                  setConfigOptions({
                    ...configOptions,
                    voiceTranslationSpeed: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
            <div className="settings-item">
              <SpeakerWaveIcon className="settings-icon" />
              <div className="settings-label">Voice Volume</div>
              <div className="settings-value">{configOptions.voiceTranslationVolume.toFixed(1)}x</div>
            </div>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={configOptions.voiceTranslationVolume}
                onChange={(e) => {
                  setConfigOptions({
                    ...configOptions,
                    voiceTranslationVolume: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
          </div>

          {/* Data Management */}
          <div className="settings-section mb-52">
            <div className="section-title">Data Management</div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() => {
                setFavorites([]);
                showCustomToast("Clear my favorites");
              }}
            >
              <TrashIcon className="settings-icon" />
              <div className="settings-label">Clear Favorites</div>
            </div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() => {
                resetState();
                showCustomToast("Factory Reset");
              }}
            >
              <ArrowPathIcon className="settings-icon" />
              <div className="settings-label">Factory Reset</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsModal;

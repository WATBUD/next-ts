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
import { Switch } from "@/components/ui/switch";
import { theme } from "../common/theme";
import { ThemeDiv } from "../common/ThemeDiv";
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
      <ThemeDiv type="background" className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center border-b sticky top-0 z-10" style={{ borderColor: theme.colors.border.light }}>
          <ThemeDiv type="background" className="p-2 rounded-full transition-colors hover:bg-gray-100">
            <button
              style={{ color: theme.colors.icon.primary }}
              onClick={() => setShowOptionUI(!showOptionUI)}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          </ThemeDiv>
          <ThemeDiv type="text" className="text-xl font-semibold flex-grow ml-3">
            Settings
          </ThemeDiv>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[81.5%]">
          {/* Language Section */}
          <div className="settings-section">
            <ThemeDiv type="text" className="section-title">
              Language
            </ThemeDiv>
            <LanguageSelector />
          </div>

          {/* Display Settings */}
          <div className="settings-section">
            <ThemeDiv type="text" className="section-title">
              Display
            </ThemeDiv>
            <div className="settings-item">
              <StarIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Show Favorites Only
              </ThemeDiv>
              <Switch
                checked={configOptions.showFavoritesListOnly}
                onCheckedChange={(checked) =>
                  setConfigOptions({
                    ...configOptions,
                    showFavoritesListOnly: checked,
                  })
                }
                className="ml-auto"
              />
            </div>
            <div className="settings-item">
              <DocumentDuplicateIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Copy Text Above
              </ThemeDiv>
              <Switch
                checked={configOptions.copyTheTextAbove}
                onCheckedChange={(checked) =>
                  setConfigOptions({
                    ...configOptions,
                    copyTheTextAbove: checked,
                  })
                }
                className="ml-auto"
              />
            </div>
            <div className="settings-item">
              <DocumentDuplicateIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Copy Text Below
              </ThemeDiv>
              <Switch
                checked={configOptions.copyTheTextBelow}
                onCheckedChange={(checked) =>
                  setConfigOptions({
                    ...configOptions,
                    copyTheTextBelow: checked,
                  })
                }
                className="ml-auto"
              />
            </div>
          </div>

          {/* Voice Settings */}
          <div className="settings-section">
            <ThemeDiv type="text" className="section-title">
              Voice
            </ThemeDiv>
            <div className="settings-item">
              <SpeakerWaveIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Voice Speed
              </ThemeDiv>
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-value">
                {configOptions.voiceTranslationSpeed.toFixed(1)}x
              </ThemeDiv>
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
              <SpeakerWaveIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Voice Volume
              </ThemeDiv>
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-value">
                {configOptions.voiceTranslationVolume.toFixed(1)}x
              </ThemeDiv>
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
            <ThemeDiv type="text" className="section-title">
              Data Management
            </ThemeDiv>
            <div 
              className="settings-item cursor-pointer"
              onClick={() => {
                setFavorites([]);
                showCustomToast("Clear my favorites");
              }}
            >
              <TrashIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Clear Favorites
              </ThemeDiv>
            </div>
            <div 
              className="settings-item cursor-pointer"
              onClick={() => {
                resetState();
                showCustomToast("Factory Reset");
              }}
            >
              <ArrowPathIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
              <ThemeDiv themeColor="#4b5563" type="text" className="settings-label">
                Factory Reset
              </ThemeDiv>
            </div>
          </div>
        </div>
      </ThemeDiv>
    </div>
  );
};

export default OptionsModal;

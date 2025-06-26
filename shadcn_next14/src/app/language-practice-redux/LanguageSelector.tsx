import React from "react";
import { useOptions } from "./redux/options-reducer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { theme } from "../../common/theme";

const LanguageSelector = () => {
  const { configOptions, updateConfigOptions } = useOptions();

  const handleLanguageChange = (index: number, lang: string) => {
    const newLanguages = [...configOptions.selectedLanguages];
    const existingIndex = newLanguages.indexOf(lang);

    if (existingIndex !== -1 && existingIndex !== index) {
      const temp = newLanguages[index];
      newLanguages[index] = newLanguages[existingIndex];
      newLanguages[existingIndex] = temp;
    } else {
      newLanguages[index] = lang;
    }

    updateConfigOptions((prevOptions) => ({
      ...prevOptions,
      selectedLanguages: newLanguages,
    }));

    console.log(
      "%c LanguageSelector+handleLanguageChange",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
      "configOptions:",
      configOptions
    );
  };

  return (
    <div className="w-full">
      {[0, 1].map((index) => (
        <div key={index} className="settings-item">
          <GlobeAltIcon className="settings-icon" style={{ color: theme.colors.icon.primary }} />
          <div className="settings-label">
            {index === 0 ? "Source Language" : "Target Language"}
          </div>
          <div className="flex-1 relative">
            <Select
              value={configOptions.selectedLanguages[index]}
              onValueChange={(value) => handleLanguageChange(index, value)}
            >
              <SelectTrigger className="w-full bg-transparent border-none focus:ring-0 p-0 text-base">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent 
                position="popper" 
                sideOffset={5}
                className="z-[9999]"
                style={{
                  position: 'absolute',
                  width: 'var(--radix-select-trigger-width)',
                  minWidth: '100%',
                }}
              >
                <SelectItem className="text-base" value="en">English</SelectItem>
                <SelectItem className="text-base" value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageSelector;
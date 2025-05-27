import React from "react";
import { useOptions } from "./redux/options_reducer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

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
      "%c languageSelector+handleLanguageChange",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
      "configOptions:",
      configOptions
    );
  };

  return (
    <div className="w-full">
      {[0, 1].map((index) => (
        <div key={index} className="settings-item">
          <GlobeAltIcon className="settings-icon" />
          <div className="settings-label">
            {index === 0 ? "Source Language" : "Target Language"}
          </div>
          <div className="flex-1">
            <Select
              value={configOptions.selectedLanguages[index]}
              onValueChange={(value) => handleLanguageChange(index, value)}
            >
              <SelectTrigger className="w-full bg-transparent border-none focus:ring-0 p-0">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageSelector;
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

const LanguageSelector = () => {
  const { configOptions, updateConfigOptions } = useOptions();

  const handleLanguageChange = (index: number, lang: string) => {
    const newLanguages = [...configOptions.selectedLanguages];

    // Check if the new language is already in the array
    const existingIndex = newLanguages.indexOf(lang);

    if (existingIndex !== -1 && existingIndex !== index) {
      // Swap the elements if the lang exists and it's not the same index
      const temp = newLanguages[index];
      newLanguages[index] = newLanguages[existingIndex];
      newLanguages[existingIndex] = temp;
    } else {
      // Otherwise, update the language as usual
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
    <div className="flex flex-col mb-4 px-2 space-y-4">
      <div className="flex flex-col space-y-2">
        <Label className="text-lg text-center">Select Languages:</Label>
        {[0, 1].map((index) => (
          <div key={index} className="flex flex-col items-center w-full space-y-2">
            <Label className="text-md">
              Language {index + 1}
            </Label>
            <Select
              value={configOptions.selectedLanguages[index]}
              onValueChange={(value) => handleLanguageChange(index, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
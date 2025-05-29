import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import languageDataSheet from "../data/language-data-sheet.json";
import { downloadJSONFile } from "@/app/common/shared-function";
import { SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { theme } from "../../common/theme";
import { translateTextAndSpeak } from "../../common/shared-function";
import { useOptions } from "../redux/options-reducer";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedTags,
  onTagsChange,
}) => {
  const { configOptions } = useOptions();
  
  // Get unique tags from the language data sheet and sort alphabetically
  const uniqueTags = Array.from(
    new Set(
      languageDataSheet.flatMap(
        (item) => item.tag?.split(",").map((t) => t.trim()) || []
      )
    )
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const [localSelectedTags, setLocalSelectedTags] =
    useState<string[]>(selectedTags);

  useEffect(() => {
    setLocalSelectedTags(selectedTags);
  }, [selectedTags]);

  const handleTagToggle = (tag: string) => {
    const newTags = localSelectedTags.includes(tag)
      ? localSelectedTags.filter((t) => t !== tag)
      : [...localSelectedTags, tag];
    setLocalSelectedTags(newTags);
  };

  const handleApply = () => {
    console.log(
      "%c FilterModal+handleApply",
      "color:#BB3D00;font-family:system-ui;font-size:2rem;font-weight:bold",
      "localSelectedTags",
      localSelectedTags
    );
  
    onTagsChange(localSelectedTags);
    onClose();
  };

  const handleReset = () => {
    setLocalSelectedTags([]);
  };

  const handlePlayAudio = (tag: string) => {
    translateTextAndSpeak(
      tag,
      configOptions.voiceTranslationSpeed,
      configOptions.voiceTranslationVolume
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter by Tags</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {uniqueTags.map((tag) => (
              <div key={tag} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={localSelectedTags.includes(tag)}
                    onCheckedChange={() => handleTagToggle(tag)}
                  />
                  <Label htmlFor={tag}>{tag}</Label>
                </div>
                <button
                  className="hover:opacity-80 transition-opacity p-1"
                  onClick={() => handlePlayAudio(tag)}
                >
                  <SpeakerWaveIcon
                    className="h-5 w-5 fill-current"
                    style={{ color: theme.colors.icon.primary }}
                  />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal; 
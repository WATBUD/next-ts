import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import languageDataSheet from "../data/language-data-sheet.json";
import { downloadJSONFile } from "@/common/shared-function";
import { SpeakerWaveIcon, CheckIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/solid";
import { theme } from "../../../common/theme";
import { translateTextAndSpeak } from "../../../common/shared-function";
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
  
  const allListTags = Array.from(
    new Set(
      languageDataSheet.flatMap(
        (item) => item.tag?.split(",").map((t) => t.trim()) || []
        //(item) => item.tag
      )
    )
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags);
  const [showOnlyChecked, setShowOnlyChecked] = useState<boolean | null>(null);

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

  const filteredTags = allListTags.filter(tag => {
    if (showOnlyChecked === null) return true;
    return showOnlyChecked 
      ? localSelectedTags.includes(tag)
      : !localSelectedTags.includes(tag);
  });

  const handleReset = () => {
    setLocalSelectedTags([]);
    setShowOnlyChecked(null);
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
      <DialogContent 
        className="max-w-[480px] p-0 overflow-hidden [&>button]:hidden w-full"
        aria-describedby="filter-dialog-description"
      >
        <DialogHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <FunnelIcon className="h-5 w-5 text-primary" />
            <DialogTitle className="text-lg font-semibold mr-auto pl-2">Filter Tags</DialogTitle>
            <DialogClose className="p-1.5 rounded-full hover:bg-accent">
              <XMarkIcon className="h-5 w-5 text-muted-foreground" />
            </DialogClose>
          </div>
        </DialogHeader>
        <ScrollArea className="h-[300px] px-6">
          <div className="py-1">
            {filteredTags.map((tag) => (
              <div 
                key={tag} 
                className="flex items-center justify-between group hover:bg-accent/50 rounded-md my-1 transition-colors cursor-pointer"
                onClick={() => handleTagToggle(tag)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id={tag}
                      checked={localSelectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                      className="cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <Label 
                    htmlFor={tag} 
                    className={`text-sm font-medium leading-none py-2 px-1 select-none ${
                      localSelectedTags.includes(tag) ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {tag}
                  </Label>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(tag);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-accent transition-all"
                  title="Play pronunciation"
                >
                  <SpeakerWaveIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="space-y-4 p-4 pt-0">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
              <Button 
                variant={showOnlyChecked === true ? "default" : "outline"}
                size="sm"
                className="gap-2 flex-1"
                onClick={() => setShowOnlyChecked(showOnlyChecked === true ? null : true)}
              >
                {showOnlyChecked === true ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4 border-2 border-muted-foreground rounded-sm" />
                )}
                <span>Checked</span>
              </Button>
              <Button 
                variant={showOnlyChecked === false ? "default" : "outline"}
                size="sm"
                className="gap-2 flex-1"
                onClick={() => setShowOnlyChecked(showOnlyChecked === false ? null : false)}
              >
                {showOnlyChecked === false ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4 border-2 border-muted-foreground rounded-sm" />
                )}
                <span>Unchecked</span>
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">
              {filteredTags.length} of {allListTags.length} tags
            </span>
          </div>
          
          <div className="flex justify-between gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="gap-2 flex-1"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Reset All</span>
            </Button>
            <Button 
              onClick={handleApply}
              className="gap-2 flex-1"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Apply ({localSelectedTags.length})</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal; 
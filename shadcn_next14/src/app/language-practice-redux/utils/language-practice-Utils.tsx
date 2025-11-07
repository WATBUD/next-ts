import languageDataSheet from "../data/language-data-sheet.json";

export const checkDuplicates = () => {
  const zhMap = new Map();
  const duplicates: { zh: string; indices: any[]; }[] = [];
  
  languageDataSheet.forEach((item: { translations: { zh: string }; index: any; }) => {
    const zhTranslation = item.translations.zh; // 獲取 zh 翻譯
    if (zhMap.has(zhTranslation) && zhMap.get(zhTranslation) !== item.index) {
      duplicates.push({
        zh: zhTranslation,
        indices: [zhMap.get(zhTranslation), item.index]
      });
    } else {
      zhMap.set(zhTranslation, item.index);
    }
  });
  
  console.log(
    "%c checkDuplicates",
    "color:#DDDD00;font-family:system-ui;font-size:2rem;font-weight:bold",
    "duplicates:",
    duplicates
  );
}



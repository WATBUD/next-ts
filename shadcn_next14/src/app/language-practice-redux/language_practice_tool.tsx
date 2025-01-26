import language_data_sheet from "./language_data_sheet.json";

export const toggleStarred = (
  index: number,
  favorites: number[],
  setFavorites: (favorites: number[]) => void,
  showCustomToast: (message: string) => void
) => {
  if (favorites.includes(index)) {
    setFavorites(favorites.filter((item) => item !== index));
    showCustomToast("已取消收藏");
  } else {
    setFavorites([...favorites, index]);
    showCustomToast("已收藏");
  }
};

export const checkDuplicates = () => {
  const zhMap = new Map();
  const duplicates: { zh: string; indices: any[]; }[] = [];
  
  language_data_sheet.forEach((item: { translations: { zh: string }; index: any; }) => {
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



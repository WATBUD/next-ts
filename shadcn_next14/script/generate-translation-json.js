const fs = require("fs");
const path = require("path");

// 固定檔案路徑
//const inputPath = path.resolve("script/language-data-sheet.txt");
const inputPath = path.resolve("script/language-data-sheet-game.txt");
const outputPath = path.resolve("src/app/language-practice-redux/data/language-data-sheet.json");

// 讀取 txt
const content = fs.readFileSync(inputPath, "utf-8").trim();
const lines = content.split(/\r?\n/);

// 從第一行提取 tag (格式: /*tag: MapleStory*/)
const tagLine = lines[0].trim();
const tagMatch = tagLine.match(/\/\*tag:\s*(.+?)\*\//);
if (!tagMatch) {
  console.error("❌ 第一行必須為 tag 格式: /*tag: <tag>*/");
  process.exit(1);
}
const tag = tagMatch[1].trim();

// 移除第一行 (tag 行) 並過濾空行
const translationLines = lines.slice(1).filter(line => line.trim() !== "");

if (translationLines.length % 2 !== 0) {
  console.error("❌ 翻譯內容必須為偶數行 (一行中文 + 一行英文)");
  process.exit(1);
}

// 確保資料夾存在
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 讀取已存在 JSON
let existingData = [];
let maxIndex = 0;
if (fs.existsSync(outputPath)) {
  try {
    const existingContent = fs.readFileSync(outputPath, "utf-8");
    existingData = JSON.parse(existingContent);
    if (existingData.length > 0) {
      maxIndex = Math.max(...existingData.map(item => item.index));
    }
  } catch (err) {
    console.warn("⚠️ 讀取現有 JSON 失敗，將覆蓋檔案");
  }
}

// 生成新資料，從 maxIndex+1 開始
let index = maxIndex + 1;
const newData = [];

for (let i = 0; i < translationLines.length; i += 2) {
  const zh = translationLines[i].trim();
  const en = translationLines[i + 1].trim();

  newData.push({
    index: index++,
    translations: { en, zh },
    tag,
  });
}

// 合併並依 index 大到小排序
const mergedData = [...existingData, ...newData].sort((a, b) => b.index - a.index);

// 輸出 JSON
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), "utf-8");

console.log(`✅ 已讀取 ${inputPath}`);
console.log(`✅ 已合併並輸出 ${outputPath}`);
console.log(`📌 新增了 ${newData.length} 筆資料，index 從 ${maxIndex + 1} 開始`);

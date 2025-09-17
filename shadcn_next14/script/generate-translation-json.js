const fs = require("fs");
const path = require("path");

// 用法: node convert.js 100 MapleStory
const [,, startIndex, tag] = process.argv;

if (!startIndex || !tag) {
  console.error("用法: node convert.js <startIndex> <tag>");
  process.exit(1);
}

// 固定檔案路徑
const inputPath = path.resolve("script/language-data-sheet.txt");
const outputPath = path.resolve("src/app/language-practice-redux/data/language-data-sheet.json");

// 讀取 txt
const content = fs.readFileSync(inputPath, "utf-8").trim();
const lines = content.split(/\r?\n/);

if (lines.length % 2 !== 0) {
  console.error("❌ txt 檔案內容必須為偶數行 (一行中文 + 一行英文)");
  process.exit(1);
}

// 生成新資料
let index = parseInt(startIndex, 10);
const newData = [];

for (let i = 0; i < lines.length; i += 2) {
  const zh = lines[i].trim();
  const en = lines[i + 1].trim();

  newData.push({
    index: index++,
    translations: { en, zh },
    tag,
  });
}

// 確保資料夾存在
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 讀取已存在 JSON
let existingData = [];
if (fs.existsSync(outputPath)) {
  try {
    const existingContent = fs.readFileSync(outputPath, "utf-8");
    existingData = JSON.parse(existingContent);
  } catch (err) {
    console.warn("⚠️ 讀取現有 JSON 失敗，將覆蓋檔案");
  }
}

// 合併並依 index 大到小排序
const mergedData = [...existingData, ...newData].sort((a, b) => b.index - a.index);

// 輸出 JSON
fs.writeFileSync(outputPath, JSON.stringify(mergedData, null, 2), "utf-8");

console.log(`✅ 已讀取 ${inputPath}`);
console.log(`✅ 已合併並輸出 ${outputPath}`);

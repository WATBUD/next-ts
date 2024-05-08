
import type { Metadata } from "next";
import SearchList from './searchList';

import { OptionsProvider } from './optionsContext'; // 导入 OptionsProvider

export const metadata: Metadata = {
  title: "language_practice_tool",
  description: "Generated by create next app",
};


const App: React.FC = () => {
  return (
    <div>
      {/* 这里是你的内容 */}
      <OptionsProvider>
        <SearchList />
      </OptionsProvider>
    </div>
  );
};
export default App;

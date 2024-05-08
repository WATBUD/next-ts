"use client"

// OptionsContext.tsx

import React, { createContext, useContext, useState, PropsWithChildren } from 'react';

// 定義 Context
type OptionsContextType = {
  // 定義你的 options 和 setOptions
  showFavoritesListOnly: boolean;
  setShowFavoritesListOnly: React.Dispatch<React.SetStateAction<boolean>>;
  showOptionUI: boolean;
  setshowOptionUI: React.Dispatch<React.SetStateAction<boolean>>;
};

// 創建 Context
const OptionsContext = createContext<OptionsContextType | undefined>(undefined);

// 提供 Context 的 Component
export const OptionsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [showFavoritesListOnly, setShowFavoritesListOnly] = useState<boolean>(false);
  const [showOptionUI, setshowOptionUI] = useState<boolean>(false);

  return (
    <OptionsContext.Provider value={{ showFavoritesListOnly, setShowFavoritesListOnly,showOptionUI, setshowOptionUI }}>
      {children}
    </OptionsContext.Provider>
  );
};

// 自定義 hook 來使用 Context
export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) {
    throw new Error('useOptions must be used within an OptionsProvider');
  }
  return context;
};

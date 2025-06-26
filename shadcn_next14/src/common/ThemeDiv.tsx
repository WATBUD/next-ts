import React from 'react';
import { theme } from './theme';

interface ThemeDivProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?: 'text' | 'background' | 'border' | 'icon';
  themeColor?: string; // 直接指定顏色代碼
}

export const ThemeDiv: React.FC<ThemeDivProps> = ({ 
  children, 
  className = '', 
  style = {},
  type = 'text',
  themeColor
}) => {
  const getThemeColor = () => {
    // 如果提供了直接的顏色代碼，優先使用
    if (themeColor) {
      return themeColor;
    }

    // 否則使用主題中的 primary 顏色
    switch (type) {
      case 'text':
        return theme.colors.text.primary;
      case 'background':
        return theme.colors.background.primary;
      case 'border':
        return theme.colors.border.light;
      case 'icon':
        return theme.colors.icon.primary;
      default:
        return theme.colors.text.primary;
    }
  };

  return (
    <div 
      className={className}
      style={{
        color: type === 'text' ? getThemeColor() : undefined,
        backgroundColor: type === 'background' ? getThemeColor() : undefined,
        borderColor: type === 'border' ? getThemeColor() : undefined,
        ...style
      }}
    >
      {children}
    </div>
  );
}; 
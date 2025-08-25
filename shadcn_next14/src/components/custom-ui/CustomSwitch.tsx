import React, { useState, useEffect, CSSProperties } from 'react';

interface CustomSwitchProps {
  checked?: boolean;                 // 可選：外部可控制
  onChange?: (checked: boolean) => void; // 可選：外部 callback
  disabled?: boolean;
  width?: number;
  height?: number;
  thumbSize?: number;
  onColor?: string;
  offColor?: string;
  thumbOnColor?: string;
  thumbOffColor?: string;
  className?: string;
  style?: CSSProperties;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  width = 50,
  height = 24,
  thumbSize = 20,
  onColor = '#f00',
  offColor = '#ccc',
  thumbOnColor = '#fff',
  thumbOffColor = '#fff',
  className = '',
  style = {},
}) => {
  // 如果外部有傳 checked 就用外部控制，否則用內部 state
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (isControlled) {
      setInternalChecked(checked!);
    }
  }, [checked, isControlled]);

  const toggleSwitch = () => {
    if (disabled) return;

    const newChecked = !isChecked;

    // 如果是非受控模式 → 自己切換 state
    if (!isControlled) {
      setInternalChecked(newChecked);
    }

    // 有帶 onChange → 呼叫外部 callback
    onChange?.(newChecked);
  };

  const containerStyle: CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...style,
  };

  const trackStyle: CSSProperties = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: `${height / 2}px`,
    backgroundColor: isChecked ? onColor : offColor,
    transition: 'background-color 0.3s',
  };

  const thumbMargin = 2;

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: isChecked
      ? `${width - thumbSize - thumbMargin}px`
      : `${thumbMargin}px`,
    transform: 'translateY(-50%)',
    width: `${thumbSize}px`,
    height: `${thumbSize}px`,
    borderRadius: '50%',
    backgroundColor: isChecked ? thumbOnColor : thumbOffColor,
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div className={className} style={containerStyle} onClick={toggleSwitch}>
      <div style={trackStyle}>
        <div style={thumbStyle} />
      </div>
    </div>
  );
};

export default CustomSwitch;

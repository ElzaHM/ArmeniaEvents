import type { ThemeConfig } from 'antd';

/** Same shade as Profile / Settings input fields */
const INPUT_BG = 'rgba(34, 36, 42, 0.88)';
const INPUT_BG_HOVER = 'rgba(42, 44, 52, 0.92)';
const INPUT_BG_ALT = 'rgba(34, 36, 42, 0.82)';

export const adminLightContentTheme: ThemeConfig = {
  token: {
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.82)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.62)',
    colorTextPlaceholder: 'rgba(255, 255, 255, 0.5)',
    colorBgContainer: INPUT_BG,
    colorBgElevated: INPUT_BG,
    colorBorder: 'rgba(255, 255, 255, 0.25)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.14)',
    colorPrimary: '#ffd27a',
    colorFillAlter: INPUT_BG_ALT,
    colorFillSecondary: INPUT_BG,
    colorBgLayout: 'transparent',
  },
  components: {
    Form: {
      labelColor: '#ffffff',
    },
    Input: {
      colorBgContainer: INPUT_BG,
      colorText: '#ffffff',
      colorBorder: 'rgba(255, 255, 255, 0.25)',
      hoverBorderColor: 'rgba(255, 210, 122, 0.52)',
      activeBorderColor: '#ffd27a',
    },
    Select: {
      colorBgContainer: INPUT_BG,
      colorBgElevated: INPUT_BG,
      colorText: '#ffffff',
      optionActiveBg: 'rgba(255, 210, 122, 0.18)',
      optionSelectedBg: 'rgba(255, 210, 122, 0.22)',
      optionSelectedColor: '#ffd27a',
    },
    Button: {
      defaultBg: INPUT_BG,
      defaultColor: '#ffffff',
      defaultBorderColor: 'rgba(255, 255, 255, 0.25)',
      defaultHoverBg: INPUT_BG_HOVER,
      defaultHoverColor: '#ffd27a',
      defaultHoverBorderColor: 'rgba(255, 210, 122, 0.52)',
      primaryColor: '#14161c',
    },
    Table: {
      colorBgContainer: INPUT_BG,
      headerBg: 'rgba(28, 30, 36, 0.96)',
      headerColor: 'rgba(255, 255, 255, 0.82)',
      rowHoverBg: INPUT_BG_HOVER,
      borderColor: 'rgba(255, 255, 255, 0.12)',
      colorText: '#ffffff',
      colorTextHeading: 'rgba(255, 255, 255, 0.82)',
    },
    Pagination: {
      itemBg: 'transparent',
      itemActiveBg: 'rgba(255, 210, 122, 0.22)',
      colorText: 'rgba(255, 255, 255, 0.82)',
      colorPrimary: '#ffd27a',
      colorPrimaryHover: '#ffd27a',
    },
    Modal: {
      contentBg: INPUT_BG,
      headerBg: INPUT_BG,
      titleColor: '#ffffff',
      colorIcon: 'rgba(255, 255, 255, 0.72)',
    },
    Switch: {
      colorTextQuaternary: 'rgba(255, 255, 255, 0.28)',
      colorPrimary: '#ffd27a',
    },
    Upload: {
      colorText: '#ffffff',
    },
    Dropdown: {
      colorBgElevated: INPUT_BG,
      colorText: '#ffffff',
    },
    Tag: {
      defaultBg: '#374151',
      defaultColor: '#f3f4f6',
      colorSuccessBg: '#15803d',
      colorSuccess: '#ecfdf5',
      colorWarningBg: '#b45309',
      colorWarning: '#fffbeb',
      colorErrorBg: '#b91c1c',
      colorError: '#fef2f2',
      colorInfoBg: '#1d4ed8',
      colorInfo: '#eff6ff',
    },
  },
};

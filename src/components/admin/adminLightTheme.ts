import type { ThemeConfig } from 'antd';

/** Solid admin surfaces — aligned with table row/header palette */
const INPUT_BG = '#22242a';
const INPUT_BG_HOVER = '#2a2c34';
const INPUT_BG_ALT = '#1f2127';
const HEADER_BG = '#1c1e24';

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
      colorPrimary: '#f2c200',
      colorPrimaryHover: '#e6b800',
      colorPrimaryActive: '#e6b800',
      colorError: '#ef4444',
      colorErrorHover: '#fca5a5',
      colorErrorActive: '#fca5a5',
      colorErrorBorder: 'rgba(239, 68, 68, 0.45)',
      colorErrorBg: 'rgba(239, 68, 68, 0.12)',
      colorErrorBgHover: 'rgba(239, 68, 68, 0.22)',
      dangerColor: '#fca5a5',
      dangerShadow: '0 0 0 0 transparent',
      defaultShadow: '0 0 0 0 transparent',
      primaryShadow: '0 0 0 0 transparent',
    },
    Table: {
      colorBgContainer: '#22242a',
      headerBg: HEADER_BG,
      headerColor: 'rgba(255, 255, 255, 0.82)',
      rowHoverBg: INPUT_BG_HOVER,
      borderColor: 'rgba(255, 255, 255, 0.25)',
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
      contentBg: '#22242a',
      headerBg: '#22242a',
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
      defaultColor: '#ffffff',
      colorSuccessBg: '#15803d',
      colorSuccess: '#ecfdf5',
      colorWarningBg: '#b45309',
      colorWarning: '#fffbeb',
      colorErrorBg: '#b91c1c',
      colorError: '#fef2f2',
      colorInfoBg: '#1d4ed8',
      colorInfo: '#ffffff',
    },
  },
};

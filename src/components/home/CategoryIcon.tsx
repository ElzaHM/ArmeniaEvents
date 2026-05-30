import {
  CodeOutlined,
  BankOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
  BgColorsOutlined,
  CameraOutlined,
  BulbOutlined,
} from '@ant-design/icons';

import type { CategoryIconName } from './types';

interface CategoryIconProps {
  name: CategoryIconName;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  switch (name) {
    case 'code':
      return <CodeOutlined className={className} />;
    case 'briefcase':
      return <BankOutlined className={className} />;
    case 'rocket':
      return <RocketOutlined className={className} />;
    case 'music':
      return <CustomerServiceOutlined className={className} />;
    case 'palette':
      return <BgColorsOutlined className={className} />;
    case 'camera':
      return <CameraOutlined className={className} />;
    case 'bulb':
      return <BulbOutlined className={className} />;
    default:
      return null;
  }
}

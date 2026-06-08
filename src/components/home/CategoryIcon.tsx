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
import { resolveCategoryIconName } from './categoryIconUtils';

interface CategoryIconProps {
  name: CategoryIconName;
  categoryName?: string;
  className?: string;
}

export function CategoryIcon({ name, categoryName, className }: CategoryIconProps) {
  const iconName = categoryName ? resolveCategoryIconName(categoryName, name) : name;

  switch (iconName) {
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
      return <BulbOutlined className={className} />;
  }
}

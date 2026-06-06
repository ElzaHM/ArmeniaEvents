import type { CategoryIconName } from './types';

const VALID_ICONS: CategoryIconName[] = [
  'code',
  'briefcase',
  'rocket',
  'music',
  'palette',
  'camera',
  'bulb',
];

const NAME_ICON_MAP: Record<string, CategoryIconName> = {
  programming: 'code',
  technology: 'code',
  tech: 'code',
  'ai & tech': 'bulb',
  'ai and tech': 'bulb',
  business: 'briefcase',
  startup: 'rocket',
  startups: 'rocket',
  music: 'music',
  design: 'palette',
  art: 'camera',
  festival: 'music',
  conference: 'bulb',
  education: 'bulb',
  sports: 'rocket',
  food: 'palette',
  health: 'bulb',
  networking: 'briefcase',
};

function getFallbackIconByName(name: string): CategoryIconName {
  let hash = 0;

  for (const char of name) {
    hash = (hash + char.charCodeAt(0)) % VALID_ICONS.length;
  }

  return VALID_ICONS[hash] ?? 'bulb';
}

function matchIconByKeyword(normalizedName: string): CategoryIconName | null {
  if (normalizedName.includes('program') || normalizedName.includes('code')) {
    return 'code';
  }

  if (
    normalizedName.includes('ai') ||
    normalizedName.includes('tech') ||
    normalizedName.includes('data')
  ) {
    return 'bulb';
  }

  if (normalizedName.includes('business') || normalizedName.includes('finance')) {
    return 'briefcase';
  }

  if (normalizedName.includes('startup') || normalizedName.includes('entrepreneur')) {
    return 'rocket';
  }

  if (normalizedName.includes('music') || normalizedName.includes('concert')) {
    return 'music';
  }

  if (normalizedName.includes('design') || normalizedName.includes('ui')) {
    return 'palette';
  }

  if (normalizedName.includes('art') || normalizedName.includes('photo')) {
    return 'camera';
  }

  return null;
}

export function resolveCategoryIconName(
  name: string,
  icon?: string | null,
): CategoryIconName {
  const normalizedName = name.trim().toLowerCase();

  if (icon && VALID_ICONS.includes(icon as CategoryIconName)) {
    return icon as CategoryIconName;
  }

  if (NAME_ICON_MAP[normalizedName]) {
    return NAME_ICON_MAP[normalizedName];
  }

  const keywordMatch = matchIconByKeyword(normalizedName);
  if (keywordMatch) {
    return keywordMatch;
  }

  return getFallbackIconByName(normalizedName);
}

/** Ant Design tag colors for known Armenian event sources. */
export const SOURCE_TAG_COLORS: Record<string, string> = {
  'Opera.am': 'red',
  'Ticketon.am': 'blue',
  'VisitArmenia.am': 'green',
  'Digitec.am': 'orange',
  'Culture.am': 'purple',
  'HikeArmenia.org': 'cyan',
  'Gemini AI': 'magenta',
};

export function getSourceTagColor(source: string): string {
  if (!source) {
    return 'default';
  }

  return SOURCE_TAG_COLORS[source] ?? 'default';
}

import type { CategoryDistribution, StatMetric } from './types';

export type AnalyticsExportData = {
  stats: StatMetric[];
  categories: CategoryDistribution[];
};

function escapeCsvCell(value: string | number): string {
  const text = String(value);

  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function getStat(stats: StatMetric[], id: string): StatMetric | undefined {
  return stats.find((stat) => stat.id === id);
}

function buildCsvRow(cells: Array<string | number>): string {
  return cells.map(escapeCsvCell).join(',');
}

export function buildAnalyticsReportCsv(data: AnalyticsExportData): string {
  const generatedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const totalEvents = getStat(data.stats, 'total-events');
  const allUsers = getStat(data.stats, 'active-users');
  const pageViews = getStat(data.stats, 'page-views');

  const lines = [
    'Armenia Events Analytics Report',
    buildCsvRow(['Generated', generatedAt]),
    '',
    buildCsvRow(['Metric', 'Value']),
    buildCsvRow([totalEvents?.label ?? 'Total Events', totalEvents?.value ?? 0]),
    buildCsvRow([allUsers?.label ?? 'All Users', allUsers?.value ?? 0]),
    buildCsvRow([pageViews?.label ?? 'Page Views', pageViews?.value ?? 0]),
    '',
    buildCsvRow(['Category', 'Event Count', 'Percentage']),
  ];

  for (const category of data.categories) {
    lines.push(
      buildCsvRow([category.name, category.count, `${category.percentage}%`]),
    );
  }

  return `${lines.join('\n')}\n`;
}

export function downloadAnalyticsReportCsv(data: AnalyticsExportData): void {
  const csv = buildAnalyticsReportCsv(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const year = new Date().getFullYear();
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `analytics_report_${year}.csv`;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function printAnalyticsReport(): void {
  window.print();
}

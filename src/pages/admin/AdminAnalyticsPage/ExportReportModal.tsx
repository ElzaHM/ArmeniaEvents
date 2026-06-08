import { Modal } from 'antd';
import {
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

import styles from './ExportReportModal.module.css';

type ExportReportModalProps = {
  open: boolean;
  onClose: () => void;
  onFullPdf: () => void;
  onSummaryPdf: () => void;
  onCsv: () => void;
};

const EXPORT_OPTIONS = [
  {
    key: 'full',
    title: 'Full PDF Report',
    description: 'Print the complete analytics dashboard with charts and stat cards.',
    icon: FilePdfOutlined,
    action: 'onFullPdf' as const,
  },
  {
    key: 'summary',
    title: 'Simplified Summary PDF',
    description: 'Print a clean, minimalist summary table — ideal for sharing.',
    icon: FileTextOutlined,
    action: 'onSummaryPdf' as const,
  },
  {
    key: 'csv',
    title: 'CSV Spreadsheet',
    description: 'Download metrics and category breakdown as a spreadsheet file.',
    icon: FileExcelOutlined,
    action: 'onCsv' as const,
  },
];

export default function ExportReportModal({
  open,
  onClose,
  onFullPdf,
  onSummaryPdf,
  onCsv,
}: ExportReportModalProps) {
  const handlers = {
    onFullPdf,
    onSummaryPdf,
    onCsv,
  };

  return (
    <Modal
      open={open}
      title="Export Report"
      footer={null}
      onCancel={onClose}
      centered
      destroyOnHidden
      className={styles.modal}
      width={720}
    >
      <p className={styles.lead}>
        Choose how you would like to export your current analytics snapshot.
      </p>
      <div className={styles.optionGrid}>
        {EXPORT_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <button
              key={option.key}
              type="button"
              className={styles.optionCard}
              onClick={() => {
                handlers[option.action]();
                onClose();
              }}
            >
              <span className={styles.optionIcon}>
                <Icon />
              </span>
              <span className={styles.optionTitle}>{option.title}</span>
              <span className={styles.optionDescription}>{option.description}</span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

import { Modal } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

import styles from './ExportReportModal.module.css';

type ExportReportModalProps = {
  open: boolean;
  onClose: () => void;
  onSummaryPdf: () => void;
};

export default function ExportReportModal({
  open,
  onClose,
  onSummaryPdf,
}: ExportReportModalProps) {
  return (
    <Modal
      open={open}
      title="Export Report"
      footer={null}
      onCancel={onClose}
      centered
      destroyOnHidden
      className="admin-detail-modal"
      width={420}
    >
      <p className={styles.lead}>
        Download a clean, simplified summary of your current analytics snapshot.
      </p>
      <div className={styles.optionGrid}>
        <button
          type="button"
          className={styles.exportOptionCard}
          onClick={() => {
            onSummaryPdf();
            onClose();
          }}
        >
          <span className={styles.exportOptionIcon}>
            <FileTextOutlined />
          </span>
          <span className={styles.exportOptionTitle}>Simplified Summary PDF</span>
          <span className={styles.exportOptionDescription}>
            Print a clean, minimalist summary table — ideal for sharing.
          </span>
        </button>
      </div>
    </Modal>
  );
}

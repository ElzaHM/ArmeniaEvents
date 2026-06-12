import { Button, Modal, Tag } from 'antd';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';

import AdminEventImage from './AdminEventImage';
import AdminOrganizerAvatar from './AdminOrganizerAvatar';
import {
  formatAdminEventDateTime,
  isAdminLinkButtonVisible,
  isGoogleSearchFallbackUrl,
} from './mapApiEventToAdminEvent';
import type { AdminEvent, AdminEventStatus } from './types';
import { getSourceTagColor } from './sourceTagUtils';

import styles from './AdminEventDetailModal.module.css';

/** Keep in sync with `@media (min-width: 600px)` in AdminEventDetailModal.module.css */
const TWO_COLUMN_LAYOUT_MIN_WIDTH_PX = 600;

const STATUS_COLORS: Record<AdminEventStatus, string> = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
};

interface AdminEventDetailModalProps {
  event: AdminEvent | null;
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
}

export default function AdminEventDetailModal({
  event,
  open,
  onClose,
  onEdit,
  onDelete,
  editLabel = 'Edit',
}: AdminEventDetailModalProps) {
  if (!event) {
    return null;
  }

  const showVerifySourceButton = isAdminLinkButtonVisible(event.sourceUrl);
  const showSearchButton =
    !showVerifySourceButton && isGoogleSearchFallbackUrl(event.sourceUrl);
  const showSourceLabelOnly =
    Boolean(event.source) && !showVerifySourceButton && !showSearchButton;
  const isFree = event.priceValue === 0 || event.price === 'Free';

  return (
    <Modal
      open={open}
      title={null}
      footer={null}
      onCancel={onClose}
      className="admin-detail-modal admin-event-detail-modal"
      width={720}
      centered
      destroyOnHidden>
      <div
        className={styles.modalShell}
        data-two-column-min-width={TWO_COLUMN_LAYOUT_MIN_WIDTH_PX}>
        <div className={styles.scrollContent}>
          <header className={styles.header}>
            <h2 className={styles.title}>{event.title}</h2>
            <div className={styles.metaTags}>
              <Tag color="gold">{event.category}</Tag>
              {event.source ? (
                <Tag color={getSourceTagColor(event.source)}>Source: {event.source}</Tag>
              ) : (
                <Tag>Manual Entry</Tag>
              )}
              <Tag color={STATUS_COLORS[event.status]}>{event.status}</Tag>
            </div>
          </header>

          <div className={styles.mainLayout}>
            <div className={styles.leftStack}>
              <AdminEventImage
                imageUrl={event.storedImageUrl}
                alt={event.title}
                className={`${styles.heroImage} ${styles.blockImage}`}
              />

              {event.description ? (
                <section className={`${styles.descriptionSection} ${styles.blockDescription}`}>
                  <h3 className={styles.sectionTitle}>Description</h3>
                  <p className={styles.description}>{event.description}</p>
                </section>
              ) : null}

              {event.tags.length > 0 ? (
                <section className={`${styles.tagsSection} ${styles.blockTags}`}>
                  <h3 className={styles.sectionTitle}>Tags</h3>
                  <div className={styles.tagList}>
                    {event.tags.map((tag) => (
                      <Tag key={tag} color="processing">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </section>
              ) : null}

              {showSourceLabelOnly ? (
                <p className={`${styles.sourceLabel} ${styles.blockSourceLabel}`}>
                  Source: {event.source}
                </p>
              ) : null}

              <section className={`${styles.section} ${styles.blockOrganizer}`}>
                <h3 className={styles.sectionTitle}>Organizer</h3>
                <div className={styles.organizerBlock}>
                  <AdminOrganizerAvatar
                    name={event.organizerName}
                    avatarUrl={event.organizerAvatarUrl}
                    avatarClassName={styles.organizerAvatar}
                    fallbackClassName={styles.organizerAvatarFallback}
                  />
                  <span className={styles.organizerName}>{event.organizerName}</span>
                </div>
              </section>
            </div>

            <div className={styles.rightStack}>
              <section className={`${styles.section} ${styles.blockSchedule}`}>
                <h3 className={styles.sectionTitle}>Schedule</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Starts</dt>
                    <dd>{formatAdminEventDateTime(event.startDate)}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Ends</dt>
                    <dd>{formatAdminEventDateTime(event.endDate)}</dd>
                  </div>
                </dl>
              </section>

              <section className={`${styles.section} ${styles.blockLocation}`}>
                <h3 className={styles.sectionTitle}>Location</h3>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Venue</dt>
                    <dd>{event.venue || 'N/A'}</dd>
                  </div>
                  <div className={styles.detailRow}>
                    <dt>Address</dt>
                    <dd>{event.address || event.location}</dd>
                  </div>
                </dl>
              </section>

              <section className={`${styles.section} ${styles.blockEventInfo}`}>
                <h3 className={styles.sectionTitle}>Event Info</h3>
                <div className={styles.infoBadges}>
                  <Tag color={isFree ? 'success' : 'gold'}>{event.price}</Tag>
                  <Tag color="blue">{event.language}</Tag>
                  <Tag color="purple">{event.ageRange}</Tag>
                </div>
                <dl className={styles.detailList}>
                  <div className={styles.detailRow}>
                    <dt>Views</dt>
                    <dd>{event.views.toLocaleString()}</dd>
                  </div>
                  {event.eventType ? (
                    <div className={styles.detailRow}>
                      <dt>Type</dt>
                      <dd>{event.eventType}</dd>
                    </div>
                  ) : null}
                  <div className={styles.detailRow}>
                    <dt>External ID</dt>
                    <dd>{event.externalId || 'N/A'}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </div>

        {onDelete || onEdit || showVerifySourceButton || showSearchButton ? (
          <footer className={styles.footer}>
            <div className={styles.footerStart}>
              {showVerifySourceButton ? (
                <Button
                  icon={<LinkOutlined />}
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  View Original Source
                </Button>
              ) : null}
              {showSearchButton ? (
                <Button
                  icon={<SearchOutlined />}
                  href={event.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  Search on Google
                </Button>
              ) : null}
            </div>
            <div className={styles.footerActions}>
              {onDelete || onEdit ? (
                <div className={styles.footerActionGroup}>
                  {onDelete ? (
                    <Button danger onClick={onDelete}>
                      Delete
                    </Button>
                  ) : null}
                  {onEdit ? (
                    <Button type="primary" className="admin-btn-edit" onClick={onEdit}>
                      {editLabel}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </footer>
        ) : null}
      </div>
    </Modal>
  );
}

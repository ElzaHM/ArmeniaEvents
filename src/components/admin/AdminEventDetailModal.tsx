import { Button, Modal, Tag } from 'antd';
import { LinkOutlined, SearchOutlined } from '@ant-design/icons';

import AdminEventImage from './AdminEventImage';
import AdminOrganizerAvatar from './AdminOrganizerAvatar';
import {
  isAdminLinkButtonVisible,
  isGoogleSearchFallbackUrl,
} from './mapApiEventToAdminEvent';
import type { AdminEvent, AdminEventStatus } from './types';
import { getSourceTagColor } from './sourceTagUtils';

import styles from './AdminEventDetailModal.module.css';

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

  const showTicketButton = isAdminLinkButtonVisible(event.ticketUrl);
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
      className="admin-detail-modal"
      width={720}
      centered
      destroyOnHidden>
      <div className={styles.modalShell}>
        <div className={styles.scrollContent}>
          <header className={styles.header}>
            <AdminEventImage
              imageUrl={event.storedImageUrl}
              alt={event.title}
              className={styles.heroImage}
            />
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

          <div className={styles.grid}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Schedule</h3>
              <dl className={styles.detailList}>
                <div className={styles.detailRow}>
                  <dt>Starts</dt>
                  <dd>{event.date}</dd>
                </div>
                <div className={styles.detailRow}>
                  <dt>Ends</dt>
                  <dd>{event.endDateDisplay}</dd>
                </div>
              </dl>
            </section>

            <section className={styles.section}>
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

            <section className={styles.section}>
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

            <section className={styles.section}>
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

          {event.description ? (
            <section className={styles.descriptionSection}>
              <h3 className={styles.sectionTitle}>Description</h3>
              <p className={styles.description}>{event.description}</p>
            </section>
          ) : null}

          {event.tags.length > 0 ? (
            <section className={styles.tagsSection}>
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
            <p className={styles.sourceLabel}>Source: {event.source}</p>
          ) : null}

          {showVerifySourceButton || showTicketButton || showSearchButton ? (
            <div className={styles.linkRow}>
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
              {showTicketButton ? (
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="admin-btn-edit">
                  Get Tickets
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        {(onDelete || onEdit) ? (
          <footer className={styles.footer}>
            {onDelete ? (
              <Button danger onClick={onDelete}>
                Delete
              </Button>
            ) : (
              <span />
            )}
            {onEdit ? (
              <Button type="primary" className="admin-btn-edit" onClick={onEdit}>
                {editLabel}
              </Button>
            ) : null}
          </footer>
        ) : null}
      </div>
    </Modal>
  );
}

import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Dropdown, Modal, Progress, Table, Tag} from "antd";
import type {MenuProps, TableColumnsType} from "antd";
import {EditOutlined, MoreOutlined} from "@ant-design/icons";

import AdminCard from "./AdminCard";
import type {AdminEvent, AdminEventStatus} from "./types";

import styles from "./UpcomingEventsTable.module.css";

const STATUS_CONFIG: Record<
  AdminEventStatus,
  {label: string; color: "success" | "warning" | "default"}
> = {
  published: {label: "Published", color: "success"},
  draft: {label: "Draft", color: "warning"},
  archived: {label: "Archived", color: "default"},
};

const ACTION_ITEMS: MenuProps["items"] = [
  {key: "edit", label: "Edit"},
  {key: "view", label: "View"},
  {key: "delete", label: "Delete", danger: true},
];

interface UpcomingEventsTableProps {
  events: AdminEvent[];
}

export default function UpcomingEventsTable({events: initialEvents}: UpcomingEventsTableProps) {
  const navigate = useNavigate();
  const [events, setEvents] = useState(initialEvents);
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const openViewModal = (event: AdminEvent) => {
    setViewingEvent(event);
  };

  const closeViewModal = () => {
    setViewingEvent(null);
  };

  const handleDeleteEvent = (event: AdminEvent) => {
    Modal.confirm({
      title: "Delete event?",
      content: `This will remove "${event.title}" from the upcoming events list.`,
      okText: "Delete",
      okButtonProps: {danger: true},
      onOk: () => {
        setEvents((currentEvents) => currentEvents.filter((item) => item.id !== event.id));
        closeViewModal();
      },
    });
  };

  const columns: TableColumnsType<AdminEvent> = [
    {
      title: "Event",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className={styles.eventCell}>
          <img src={record.imageUrl} alt="" className={styles.thumbnail} />
          <span className={styles.eventTitle}>{record.title}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["lg"],
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["xl"],
    },
    {
      title: "Views",
      key: "views",
      render: (_, record) => {
        const percent = Math.round((record.views / record.maxViews) * 100);
        return (
          <div className={styles.viewsCell}>
            <div className={styles.viewsMeta}>
              <span>{record.views.toLocaleString()}</span>
              <span>{percent}%</span>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor="var(--admin-gold)"
              railColor="var(--admin-border)"
              size="small"
            />
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: AdminEventStatus) => {
        const config = STATUS_CONFIG[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "",
      key: "actions",
      width: 48,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: ACTION_ITEMS,
            onClick: ({key, domEvent}) => {
              domEvent.stopPropagation();
              if (key === "view" || key === "edit") {
                openViewModal(record);
              }
              if (key === "delete") {
                handleDeleteEvent(record);
              }
            },
          }}
          trigger={["click"]}
          overlayClassName="admin-dropdown-menu">
          <button
            type="button"
            aria-label="Actions"
            onClick={(event) => event.stopPropagation()}>
            <MoreOutlined />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <AdminCard title="Upcoming Events">
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={events}
            rowKey="id"
            scroll={{x: "max-content"}}
            pagination={{pageSize: 5}}
            size="middle"
            onRow={(record) => ({
              onClick: () => openViewModal(record),
              className: "admin-table-row-clickable",
            })}
          />
        </div>
      </AdminCard>
      <Modal
        open={Boolean(viewingEvent)}
        title="Event Details"
        footer={null}
        onCancel={closeViewModal}
        className="admin-detail-modal"
        width={480}
        centered>
        {viewingEvent ? (
          <div className={styles.detailModal}>
            <img src={viewingEvent.imageUrl} alt="" className={styles.detailImage} />
            <dl className={styles.detailList}>
              <div className={styles.detailRow}>
                <dt>Title</dt>
                <dd>{viewingEvent.title}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Organizer</dt>
                <dd>{viewingEvent.organizerName}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Category</dt>
                <dd>{viewingEvent.category}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Location</dt>
                <dd>{viewingEvent.location}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Start Date</dt>
                <dd>{viewingEvent.date}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>End Date</dt>
                <dd>{viewingEvent.endDateDisplay}</dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Status</dt>
                <dd>
                  <Tag color={STATUS_CONFIG[viewingEvent.status].color}>
                    {STATUS_CONFIG[viewingEvent.status].label}
                  </Tag>
                </dd>
              </div>
              <div className={styles.detailRow}>
                <dt>Views</dt>
                <dd>{viewingEvent.views.toLocaleString()}</dd>
              </div>
            </dl>
            <div className={styles.detailActions}>
              <Button danger onClick={() => handleDeleteEvent(viewingEvent)}>
                Delete
              </Button>
              <Button
                type="primary"
                className="admin-btn-edit"
                icon={<EditOutlined />}
                onClick={() => navigate("/admin/events")}>
                Edit
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}

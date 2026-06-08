import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Dropdown, Modal, Progress, Table, Tag} from "antd";
import type {MenuProps, TableColumnsType} from "antd";
import {MoreOutlined} from "@ant-design/icons";

import AdminCard from "./AdminCard";
import AdminEventDetailModal from "./AdminEventDetailModal";
import AdminEventImage from "./AdminEventImage";
import {getSourceTagColor} from "./sourceTagUtils";
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

const WRAP_CELL_PROPS = {
  className: "admin-table-wrap-cell",
  style: {whiteSpace: "normal" as const, wordBreak: "break-word" as const},
};

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
      width: 260,
      onCell: () => WRAP_CELL_PROPS,
      render: (_, record) => (
        <div className={styles.eventCell}>
          <AdminEventImage
            imageUrl={record.storedImageUrl}
            alt={record.title}
            className={styles.thumbnail}
          />
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
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 160,
      onCell: () => WRAP_CELL_PROPS,
      responsive: ["lg"],
      render: (source: string) => (
        <div className={styles.sourceCell}>
          {source ? (
            <Tag color={getSourceTagColor(source)} className={styles.sourceTag}>
              {source}
            </Tag>
          ) : (
            <Tag className={styles.sourceTag}>Manual</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
      onCell: () => WRAP_CELL_PROPS,
      responsive: ["lg"],
      render: (category: string) => (
        <span className={styles.wrapText}>{category}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 200,
      onCell: () => WRAP_CELL_PROPS,
      responsive: ["xl"],
      render: (location: string) => (
        <span className={styles.locationText}>{location}</span>
      ),
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
          classNames={{root: "admin-dropdown-menu"}}>
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
      <AdminEventDetailModal
        event={viewingEvent}
        open={Boolean(viewingEvent)}
        onClose={closeViewModal}
        onEdit={() => navigate("/admin/events")}
        onDelete={() => viewingEvent && handleDeleteEvent(viewingEvent)}
        editLabel="Open Events"
      />
    </>
  );
}

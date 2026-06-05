import {useMemo, useState} from "react";
import {Button, Modal, Table, Tag, message, Space} from "antd";
import type {TableColumnsType} from "antd";
import {PlusOutlined, EditOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import type {AdminEvent, AdminEventStatus} from "../../../components/admin/types";
import {
  useDeleteEvent,
  useEvents,
  useCreateEvent,
  useUpdateEvent,
} from "../../../hooks/queries/useEvents";

import styles from "./AdminEventsPage.module.css";

const STATUS_COLORS: Record<AdminEventStatus, string> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

type EventSectionKey = "all" | "needsReview" | "liveToday" | "upcoming" | "past";

type EventSection = {
  key: EventSectionKey;
  title: string;
  description: string;
  events: AdminEvent[];
};

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getEventDate(event: AdminEvent): Date {
  return new Date(event.date);
}

export default function AdminEventsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [activeSection, setActiveSection] = useState<EventSectionKey>("all");
  const {data: eventsData = [], isLoading} = useEvents();
  const createEvent = useCreateEvent();
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();

  const events: AdminEvent[] = useMemo(
    () =>
      eventsData.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        category: event.category,
        location: event.location,
        views: 0,
        maxViews: 1000,
        status: "published",
        imageUrl: event.imageUrl,
      })),
    [eventsData],
  );

  const sections: EventSection[] = useMemo(() => {
    const now = new Date();
    const today = startOfLocalDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const needsReview = events.filter((event) => event.status === "draft");
    const liveToday = events.filter((event) => {
      const eventDate = getEventDate(event);
      return eventDate >= today && eventDate < tomorrow && event.status === "published";
    });
    const upcoming = events.filter((event) => getEventDate(event) >= tomorrow);
    const past = events.filter((event) => getEventDate(event) < today);

    return [
      {
        key: "needsReview",
        title: "Needs Review",
        description: "New events that should be added",
        events: needsReview,
      },
      {
        key: "liveToday",
        title: "Live Today",
        description: "Events currently happening",
        events: liveToday,
      },
      {
        key: "upcoming",
        title: "Upcoming",
        description: "Approved events ahead",
        events: upcoming,
      },
      {
        key: "past",
        title: "Past",
        description: "Events already finished",
        events: past,
      },
    ];
  }, [events]);

  const tableEvents =
    activeSection === "all"
      ? events
      : (sections.find((section) => section.key === activeSection)?.events ?? events);

  const activeSectionTitle =
    activeSection === "all"
      ? "All Events"
      : (sections.find((section) => section.key === activeSection)?.title ?? "All Events");

  const columns: TableColumnsType<AdminEvent> = [
    {
      title: "Event",
      key: "title",
      render: (_, record) => (
        <div className={styles.eventCell}>
          <img src={record.imageUrl} alt="" className={styles.thumbnail} />
          <span>{record.title}</span>
        </div>
      ),
    },
    {title: "Date", dataIndex: "date", key: "date"},
    {title: "Category", dataIndex: "category", key: "category"},
    {title: "Location", dataIndex: "location", key: "location", responsive: ["md"]},
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: AdminEventStatus) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            className="admin-btn-edit"
            icon={<EditOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Edit event",
                content: `Edit details for "${record.title}".`,
                okText: "OK",
                cancelText: "Cancel",
                onOk: async () => {
                  try {
                    await updateEvent.mutateAsync({
                      id: record.id,
                      payload: {
                        title: record.title,
                        start_date: record.date,
                        address: record.location,
                        venue: record.category,
                        status: record.status,
                        views: record.views,
                      },
                    });
                    messageApi.success("Event updated");
                  } catch (error) {
                    messageApi.error(error instanceof Error ? error.message : "Update failed");
                  }
                },
              });
            }}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            className="admin-btn-delete"
            onClick={() => {
              Modal.confirm({
                title: "Delete event?",
                content: `This will delete "${record.title}".`,
                onOk: async () => {
                  try {
                    await deleteEvent.mutateAsync(record.id);
                    messageApi.success("Event deleted");
                  } catch (error) {
                    messageApi.error(error instanceof Error ? error.message : "Delete failed");
                  }
                },
              });
            }}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = async () => {
    try {
      await createEvent.mutateAsync({
        title: `New Event ${new Date().toLocaleTimeString()}`,
        start_date: new Date().toISOString(),
        address: "Yerevan",
        venue: "Event Venue",
        status: "draft",
        views: 0,
      });
      messageApi.success("Event created");
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  return (
    <>
      {contextHolder}
      <AdminPageHeader title="Events" subtitle="Manage and organize all platform events." />
      <section className={styles.workflow} aria-label="Event workflow">
        <button
          type="button"
          className={`${styles.workflowCard} ${activeSection === "all" ? styles.workflowCardActive : ""}`}
          onClick={() => setActiveSection("all")}>
          <span className={styles.workflowCount}>{events.length}</span>
          <span className={styles.workflowTitle}>All Events</span>
          <span className={styles.workflowText}>Complete event list</span>
        </button>
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            className={`${styles.workflowCard} ${activeSection === section.key ? styles.workflowCardActive : ""}`}
            onClick={() => setActiveSection(section.key)}>
            <span className={styles.workflowCount}>{section.events.length}</span>
            <span className={styles.workflowTitle}>{section.title}</span>
            <span className={styles.workflowText}>{section.description}</span>
          </button>
        ))}
      </section>
      <AdminCard>
        <div className={styles.toolbar}>
          <div>
            <p className={styles.tableEyebrow}>Showing</p>
            <h2 className={styles.tableTitle}>{activeSectionTitle}</h2>
          </div>
          <Button
            type="primary"
            className="admin-btn-add"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={createEvent.isPending}>
            Add Event
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={tableEvents}
            rowKey="id"
            loading={isLoading || deleteEvent.isPending}
            pagination={{pageSize: 8}}
          />
        </div>
      </AdminCard>
    </>
  );
}

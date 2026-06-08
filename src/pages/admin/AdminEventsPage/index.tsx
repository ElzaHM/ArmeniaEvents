import {useEffect, useMemo, useRef, useState} from "react";
import {Button, Empty, Modal, Table, Tag, message, Space, Alert} from "antd";
import type {TableColumnsType} from "antd";
import {PlusOutlined, EditOutlined, CloudDownloadOutlined} from "@ant-design/icons";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate, useSearchParams} from "react-router-dom";

import AdminCard from "../../../components/admin/AdminCard";
import {adminPendingNotificationsKey} from "../../../components/admin/AdminHeader";
import AdminEventDetailModal from "../../../components/admin/AdminEventDetailModal";
import AdminEventEditModal from "../../../components/admin/AdminEventEditModal";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminEventImage from "../../../components/admin/AdminEventImage";
import AdminOrganizerAvatar from "../../../components/admin/AdminOrganizerAvatar";
import {getSourceTagColor} from "../../../components/admin/sourceTagUtils";
import type {AdminEvent, AdminEventStatus} from "../../../components/admin/types";
import {adminDashboardKeys, useAdminEventsList} from "../../../hooks/queries/useAdminDashboard";
import {useDeleteEvent} from "../../../hooks/queries/useEvents";
import {getAiSyncErrorMessage, syncLiveAiEvents} from "../../../services/admin/geminiSyncService";

import styles from "./AdminEventsPage.module.css";

const STATUS_COLORS: Record<AdminEventStatus, string> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

const WRAP_CELL_PROPS = {
  className: "admin-table-wrap-cell",
  style: {whiteSpace: "normal" as const, wordBreak: "break-word" as const},
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
  return new Date(event.startDate || event.date);
}

export default function AdminEventsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<EventSectionKey>("all");
  const [aiFetching, setAiFetching] = useState(false);
  const [aiFetchStatus, setAiFetchStatus] = useState<string | null>(null);
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const queryClient = useQueryClient();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const editEventId = searchParams.get("edit")?.trim() ?? "";
  const handledEditEventId = useRef<string | null>(null);
  const {data: allEvents = [], isLoading: isAllLoading} = useAdminEventsList();
  const {data: searchResults = [], isLoading: isSearchLoading} = useAdminEventsList(
    searchQuery || undefined,
  );
  const isLoading = searchQuery ? isSearchLoading : isAllLoading;
  const deleteEvent = useDeleteEvent();

  const clearSearch = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("q");
    setSearchParams(nextParams);
  };

  const openViewModal = (event: AdminEvent) => {
    setViewingEvent(event);
  };

  const closeViewModal = () => {
    setViewingEvent(null);
  };

  const openEditModal = (event: AdminEvent) => {
    setEditingEvent(event);
  };

  const openEditFromView = () => {
    if (!viewingEvent) {
      return;
    }

    const event = viewingEvent;
    closeViewModal();
    openEditModal(event);
  };

  const closeEditModal = () => {
    setEditingEvent(null);
    void queryClient.invalidateQueries({queryKey: adminPendingNotificationsKey});
  };

  useEffect(() => {
    if (!editEventId || isAllLoading) {
      return;
    }

    if (handledEditEventId.current === editEventId) {
      return;
    }

    const event = allEvents.find((entry) => entry.id === editEventId);

    if (!event) {
      return;
    }

    handledEditEventId.current = editEventId;
    setActiveSection(event.status === "draft" ? "needsReview" : "all");
    openEditModal(event);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("edit");
    setSearchParams(nextParams, { replace: true });
  }, [allEvents, editEventId, isAllLoading, searchParams, setSearchParams]);

  const sections: EventSection[] = useMemo(() => {
    const now = new Date();
    const today = startOfLocalDay(now);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const needsReview = allEvents.filter((event) => event.status === "draft");
    const liveToday = allEvents.filter((event) => {
      const eventDate = getEventDate(event);
      return eventDate >= today && eventDate < tomorrow && event.status === "published";
    });
    const upcoming = allEvents.filter((event) => getEventDate(event) >= tomorrow);
    const past = allEvents.filter((event) => getEventDate(event) < today);

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
  }, [allEvents]);

  const tableEvents = searchQuery
    ? searchResults
    : activeSection === "all"
      ? allEvents
      : (sections.find((section) => section.key === activeSection)?.events ?? allEvents);

  const activeSectionTitle =
    activeSection === "all"
      ? "All Events"
      : (sections.find((section) => section.key === activeSection)?.title ?? "All Events");

  const tableTitle = searchQuery
    ? `Found Events (${tableEvents.length})`
    : activeSectionTitle;

  const emptySearchDescription = `No results found for '${searchQuery}'. Please try a different search term.`;

  const handleDeleteEvent = (event: AdminEvent) => {
    Modal.confirm({
      title: "Delete event?",
      content: `This will delete "${event.title}".`,
      onOk: async () => {
        try {
          await deleteEvent.mutateAsync(event.id);
          messageApi.success("Event deleted");
          await queryClient.invalidateQueries({queryKey: adminPendingNotificationsKey});
          closeViewModal();
        } catch (error) {
          messageApi.error(error instanceof Error ? error.message : "Delete failed");
        }
      },
    });
  };

  const columns: TableColumnsType<AdminEvent> = [
    {
      title: "Event",
      key: "title",
      width: 240,
      onCell: () => WRAP_CELL_PROPS,
      sorter: (left, right) => left.title.localeCompare(right.title),
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
      title: "Organizer",
      key: "organizer",
      width: 180,
      onCell: () => WRAP_CELL_PROPS,
      responsive: ["lg"],
      render: (_, record) => (
        <div className={styles.organizerCell}>
          <AdminOrganizerAvatar
            name={record.organizerName}
            avatarUrl={record.organizerAvatarUrl}
            avatarClassName={styles.organizerAvatar}
            fallbackClassName={styles.organizerAvatarFallback}
          />
          <span className={styles.organizerName}>
            {record.organizerName}
          </span>
        </div>
      ),
    },
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      width: 150,
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      responsive: ["md"],
      sorter: (left, right) =>
        new Date(left.startDate || left.date).getTime() - new Date(right.startDate || right.date).getTime(),
    },
    {title: "Category", dataIndex: "category", key: "category", responsive: ["md"], width: 120},
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 180,
      onCell: () => WRAP_CELL_PROPS,
      responsive: ["md"],
      render: (location: string) => (
        <span className={styles.locationText}>{location}</span>
      ),
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      responsive: ["md"],
      render: (views: number) => views.toLocaleString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (left, right) => left.status.localeCompare(right.status),
      render: (status: AdminEventStatus) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 140,
      responsive: ["md"],
      render: (_, record) => (
        <Space size="small" onClick={(event) => event.stopPropagation()}>
          <Button
            type="primary"
            size="small"
            className="admin-btn-edit"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            className="admin-btn-delete"
            onClick={() => handleDeleteEvent(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/admin/events/create");
  };

  const handleAiFetchLiveData = async () => {
    setAiFetching(true);
    setAiFetchStatus("Gemini is searching the web for live events in Armenia...");

    try {
      const result = await syncLiveAiEvents({
        onRetry: (message) => {
          setAiFetchStatus(message);
          messageApi.info(message);
        },
      });

      setAiFetchStatus(null);
      await queryClient.invalidateQueries({queryKey: adminPendingNotificationsKey});

      if (result.imported > 0) {
        messageApi.success(`AI found and imported ${result.imported} new events.`);
        await queryClient.invalidateQueries({ queryKey: adminDashboardKeys.events() });
      } else {
        messageApi.info("AI fetch completed. No new events to import — your existing events were left unchanged.");
      }
    } catch (error) {
      setAiFetchStatus(null);
      messageApi.error(getAiSyncErrorMessage(error));
    } finally {
      setAiFetching(false);
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
          <span className={styles.workflowCount}>{allEvents.length}</span>
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
        {aiFetchStatus ? (
          <Alert
            type="info"
            showIcon
            title={aiFetchStatus}
            className={styles.syncAlert}
          />
        ) : null}
        <div className={styles.toolbar}>
          <div>
            <p className={styles.tableEyebrow}>{searchQuery ? "Search Results" : "Showing"}</p>
            <h2 className={styles.tableTitle}>{tableTitle}</h2>
          </div>
          <Space>
            {searchQuery ? <Button onClick={clearSearch}>Clear Search</Button> : null}
            <Button
              icon={<CloudDownloadOutlined spin={aiFetching} />}
              onClick={handleAiFetchLiveData}
              loading={aiFetching}>
              AI Fetch Live Data
            </Button>
            <Button
              type="primary"
              className="admin-btn-add"
              icon={<PlusOutlined />}
              onClick={handleCreate}>
              Add Event
            </Button>
          </Space>
        </div>
        <div className={styles.tableWrap}>
          {searchQuery && !isLoading && tableEvents.length === 0 ? (
            <div className={styles.emptyWrap}>
              <Empty description={emptySearchDescription} />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={tableEvents}
              rowKey="id"
              loading={isLoading || deleteEvent.isPending}
              pagination={{pageSize: 8}}
              scroll={{x: "max-content"}}
              onRow={(record) => ({
                onClick: () => openViewModal(record),
                className: "admin-table-row-clickable",
              })}
            />
          )}
        </div>
      </AdminCard>
      <AdminEventDetailModal
        event={viewingEvent}
        open={Boolean(viewingEvent)}
        onClose={closeViewModal}
        onEdit={openEditFromView}
        onDelete={() => viewingEvent && handleDeleteEvent(viewingEvent)}
      />
      <AdminEventEditModal
        event={editingEvent}
        open={Boolean(editingEvent)}
        onClose={closeEditModal}
      />
    </>
  );
}


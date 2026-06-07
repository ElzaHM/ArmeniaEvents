import {useMemo, useState} from "react";
import {Button, Empty, Form, Input, InputNumber, Modal, Select, Table, Tag, message, Space} from "antd";
import type {TableColumnsType} from "antd";
import {PlusOutlined, EditOutlined, CloudDownloadOutlined} from "@ant-design/icons";
import {useQueryClient} from "@tanstack/react-query";
import {useNavigate, useSearchParams} from "react-router-dom";

import {api} from "../../../api/axios";
import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import type {AdminEvent, AdminEventStatus} from "../../../components/admin/types";
import {adminDashboardKeys, useAdminEventsList} from "../../../hooks/queries/useAdminDashboard";
import {
  useDeleteEvent,
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
  return new Date(event.startDate || event.date);
}

export default function AdminEventsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [eventForm] = Form.useForm<AdminEvent>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<EventSectionKey>("all");
  const [importing, setImporting] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const queryClient = useQueryClient();
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const {data: allEvents = [], isLoading: isAllLoading} = useAdminEventsList();
  const {data: searchResults = [], isLoading: isSearchLoading} = useAdminEventsList(
    searchQuery || undefined,
  );
  const isLoading = searchQuery ? isSearchLoading : isAllLoading;
  const deleteEvent = useDeleteEvent();
  const updateEvent = useUpdateEvent();

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
    eventForm.setFieldsValue(event);
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
    eventForm.resetFields();
  };

  const handleSaveEvent = async () => {
    if (!editingEvent) {
      return;
    }

    const values = await eventForm.validateFields();

    try {
      await updateEvent.mutateAsync({
        id: editingEvent.id,
        payload: {
          title: values.title,
          start_date: values.startDate || editingEvent.startDate,
          address: values.location,
          status: values.status,
          views: values.views,
        },
      });
      messageApi.success("Event updated");
      closeEditModal();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "Update failed");
    }
  };

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
      sorter: (left, right) => left.title.localeCompare(right.title),
      render: (_, record) => (
        <div className={styles.eventCell}>
          <img src={record.imageUrl} alt="" className={styles.thumbnail} />
          <span>{record.title}</span>
        </div>
      ),
    },
    {
      title: "Organizer",
      key: "organizer",
      responsive: ["lg"],
      render: (_, record) => (
        <div className={styles.organizerCell}>
          <img src={record.organizerAvatarUrl} alt="" className={styles.organizerAvatar} />
          <span>{record.organizerName}</span>
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
    {title: "Category", dataIndex: "category", key: "category", responsive: ["md"]},
    {title: "Location", dataIndex: "location", key: "location", responsive: ["md"]},
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

  const handleImportEventbrite = async () => {
    setImporting(true);

    try {
      const { data } = await api.post<{ imported: number; skipped: number }>(
        "/api/admin/events/import/eventbrite",
        {},
      );

      messageApi.success(`Imported: ${data.imported}, Skipped: ${data.skipped}`);
      await queryClient.invalidateQueries({ queryKey: adminDashboardKeys.all });
    } catch (error) {
      const responseMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        (error.response as { data?: { message?: string } } | undefined)?.data?.message;

      messageApi.error(
        responseMessage ?? (error instanceof Error ? error.message : "Import failed"),
      );
    } finally {
      setImporting(false);
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
        <div className={styles.toolbar}>
          <div>
            <p className={styles.tableEyebrow}>{searchQuery ? "Search Results" : "Showing"}</p>
            <h2 className={styles.tableTitle}>{tableTitle}</h2>
          </div>
          <Space>
            {searchQuery ? <Button onClick={clearSearch}>Clear Search</Button> : null}
            <Button
              icon={<CloudDownloadOutlined />}
              onClick={handleImportEventbrite}
              loading={importing}>
              Import from Eventbrite
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
                <dd>
                  <div className={styles.organizerCell}>
                    <img src={viewingEvent.organizerAvatarUrl} alt="" className={styles.organizerAvatar} />
                    <span>{viewingEvent.organizerName}</span>
                  </div>
                </dd>
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
                  <Tag color={STATUS_COLORS[viewingEvent.status]}>{viewingEvent.status}</Tag>
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
              <Button type="primary" className="admin-btn-edit" onClick={openEditFromView}>
                Edit
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
      <Modal
        open={Boolean(editingEvent)}
        title="Edit event"
        okText="Save Changes"
        cancelText="Cancel"
        onOk={handleSaveEvent}
        onCancel={closeEditModal}
        confirmLoading={updateEvent.isPending}
        className="admin-detail-modal">
        <Form form={eventForm} layout="vertical">
          <Form.Item name="startDate" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="title" label="Name" rules={[{required: true, message: "Name is required"}]}>
            <Input />
          </Form.Item>
          <Form.Item name="date" label="Start Date" rules={[{required: true, message: "Date is required"}]}>
            <Input />
          </Form.Item>
          <Form.Item name="endDateDisplay" label="End Date">
            <Input readOnly />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select
              options={[
                {value: "published", label: "Published"},
                {value: "draft", label: "Draft"},
                {value: "archived", label: "Archived"},
              ]}
            />
          </Form.Item>
          <Form.Item name="views" label="Views">
            <InputNumber min={0} style={{width: "100%"}} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}


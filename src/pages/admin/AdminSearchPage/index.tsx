import {useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {Button, Empty, Modal, Spin, Table, Tag, message} from "antd";
import type {TableColumnsType} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminEventDetailModal from "../../../components/admin/AdminEventDetailModal";
import {adminPendingNotificationsKey} from "../../../components/admin/AdminHeader";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminEventImage from "../../../components/admin/AdminEventImage";
import type {AdminEvent, AdminUser, AdminUserRole, AdminUserStatus} from "../../../components/admin/types";
import {
  adminDashboardKeys,
  useAdminEventSearchCount,
  useAdminEventsList,
} from "../../../hooks/queries/useAdminDashboard";
import {useDeleteEvent} from "../../../hooks/queries/useEvents";
import {useAdminUsers} from "../../../hooks/queries/useAdminUsers";
import AdminUserModal from "../AdminUserModal";

import styles from "./AdminSearchPage.module.css";

const WRAP_CELL_PROPS = {
  className: "admin-table-wrap-cell",
  style: {whiteSpace: "normal" as const, wordBreak: "break-word" as const},
};

const TABLE_SCROLL_STYLES = {
  content: {
    overflowY: "visible" as const,
    maxHeight: "none" as const,
    height: "auto" as const,
  },
  body: {
    wrapper: {
      overflowY: "visible" as const,
      maxHeight: "none" as const,
      height: "auto" as const,
    },
  },
};

const ROLE_COLORS: Record<AdminUserRole, string> = {
  super_admin: "gold",
  admin: "blue",
  moderator: "purple",
  user: "default",
};

const STATUS_COLORS: Record<AdminUserStatus, string> = {
  active: "success",
  inactive: "default",
  pending: "warning",
};

const emptyDescription = (query: string) =>
  `No results found for '${query}'. Please try a different search term.`;

export default function AdminSearchPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const searchQuery = searchParams.get("q")?.trim() ?? "";
  const normalizedQuery = searchQuery.toLowerCase();
  const {data: events = [], isLoading: isEventsLoading} = useAdminEventsList(
    searchQuery || undefined,
  );
  const {data: users = [], isLoading: isUsersLoading} = useAdminUsers();
  const {data: eventSearchCount = 0, isLoading: isEventCountLoading} = useAdminEventSearchCount(
    searchQuery,
    Boolean(searchQuery),
  );
  const deleteEvent = useDeleteEvent();

  const filteredUsers = useMemo(() => {
    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      const name = user.name.toLowerCase();
      const email = user.email.toLowerCase();
      return name.includes(normalizedQuery) || email.includes(normalizedQuery);
    });
  }, [normalizedQuery, users]);

  const refreshSearchEvents = async () => {
    await queryClient.invalidateQueries({queryKey: adminDashboardKeys.events(searchQuery)});
    await queryClient.invalidateQueries({queryKey: adminDashboardKeys.searchCount(searchQuery)});
  };

  const openEventModal = (event: AdminEvent) => {
    setViewingEvent(event);
  };

  const closeEventModal = () => {
    setViewingEvent(null);
  };

  const openUserModal = (user: AdminUser) => {
    setSelectedUser(user);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
  };

  const handleEditEvent = () => {
    if (!viewingEvent) {
      return;
    }

    const eventId = viewingEvent.id;
    closeEventModal();
    navigate(`/admin/events?edit=${encodeURIComponent(eventId)}`);
  };

  const handleDeleteEvent = (event: AdminEvent) => {
    Modal.confirm({
      title: "Delete event?",
      content: `This will delete "${event.title}".`,
      okText: "Delete",
      okButtonProps: {danger: true},
      onOk: async () => {
        try {
          await deleteEvent.mutateAsync(event.id);
          messageApi.success("Event deleted");
          await refreshSearchEvents();
          await queryClient.invalidateQueries({queryKey: adminPendingNotificationsKey});
          closeEventModal();
        } catch (error) {
          messageApi.error(error instanceof Error ? error.message : "Delete failed");
        }
      },
    });
  };

  const eventColumns: TableColumnsType<AdminEvent> = [
    {
      title: "Event",
      key: "title",
      width: 260,
      onCell: () => WRAP_CELL_PROPS,
      render: (_, record) => (
        <div className={styles.eventCell}>
          <AdminEventImage
            imageUrl={record.imageUrl}
            alt=""
            className={styles.thumbnail}
          />
          <span className={styles.clampTwoLines}>{record.title}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      responsive: ["md"],
      onCell: () => WRAP_CELL_PROPS,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 140,
      responsive: ["md"],
      onCell: () => WRAP_CELL_PROPS,
      render: (category: string) => (
        <span className={styles.clampTwoLines}>{category}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      width: 250,
      responsive: ["md"],
      onCell: () => WRAP_CELL_PROPS,
      render: (location: string) => (
        <span className={styles.locationText}>{location}</span>
      ),
    },
  ];

  const userColumns: TableColumnsType<AdminUser> = [
    {
      title: "Name",
      key: "name",
      width: 200,
      onCell: () => WRAP_CELL_PROPS,
      render: (_, record) => (
        <div className={styles.userCell}>
          <img src={record.avatarUrl} alt="" className={styles.avatar} />
          <span className={styles.clampTwoLines}>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250,
      responsive: ["md"],
      onCell: () => WRAP_CELL_PROPS,
      render: (email: string) => (
        <span className={styles.clampTwoLines}>{email}</span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      responsive: ["md"],
      render: (role: AdminUserRole) => <Tag color={ROLE_COLORS[role]}>{role.replace("_", " ")}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: AdminUserStatus) => <Tag color={STATUS_COLORS[status]}>{status}</Tag>,
    },
  ];

  return (
    <>
      {contextHolder}
      <div className={styles.topActions}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </div>
      <AdminPageHeader title="Search" subtitle="Search across admin events and users." />
      {searchQuery ? (
        <div className={styles.sections}>
          <AdminCard>
            <h2 className={styles.sectionTitle}>
              Found Events ({isEventCountLoading ? "…" : eventSearchCount})
            </h2>
            {isEventsLoading ? (
              <div className={styles.loadingWrap}>
                <Spin />
              </div>
            ) : events.length === 0 ? (
              <div className={styles.emptyWrap}>
                <Empty description={emptyDescription(searchQuery)} />
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <Table
                  size="middle"
                  columns={eventColumns}
                  dataSource={events}
                  rowKey="id"
                  loading={deleteEvent.isPending}
                  pagination={{pageSize: 8}}
                  scroll={{x: "max-content"}}
                  styles={TABLE_SCROLL_STYLES}
                  onRow={(record) => ({
                    onClick: () => openEventModal(record),
                    className: "admin-table-row-clickable",
                  })}
                />
              </div>
            )}
          </AdminCard>

          <AdminCard>
            <h2 className={styles.sectionTitle}>Found Users ({filteredUsers.length})</h2>
            {isUsersLoading ? (
              <div className={styles.loadingWrap}>
                <Spin />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className={styles.emptyWrap}>
                <Empty description={emptyDescription(searchQuery)} />
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <Table
                  size="middle"
                  columns={userColumns}
                  dataSource={filteredUsers}
                  rowKey="id"
                  pagination={{pageSize: 8}}
                  scroll={{x: "max-content"}}
                  styles={TABLE_SCROLL_STYLES}
                  onRow={(record) => ({
                    onClick: () => openUserModal(record),
                    className: "admin-table-row-clickable",
                  })}
                />
              </div>
            )}
          </AdminCard>
        </div>
      ) : (
        <AdminCard>
          <div className={styles.emptyWrap}>
            <Empty description="Enter a search term in the header to find events and users." />
          </div>
        </AdminCard>
      )}
      <AdminEventDetailModal
        event={viewingEvent}
        open={Boolean(viewingEvent)}
        onClose={closeEventModal}
        onEdit={handleEditEvent}
        onDelete={() => viewingEvent && handleDeleteEvent(viewingEvent)}
      />
      <AdminUserModal
        user={selectedUser}
        open={Boolean(selectedUser)}
        onClose={closeUserModal}
      />
    </>
  );
}

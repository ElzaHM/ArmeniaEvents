import {useMemo} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Button, Empty, Spin, Table, Tag} from "antd";
import type {TableColumnsType} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import AdminEventImage from "../../../components/admin/AdminEventImage";
import type {AdminEvent, AdminUser, AdminUserRole, AdminUserStatus} from "../../../components/admin/types";
import {
  useAdminEventSearchCount,
  useAdminEventsList,
} from "../../../hooks/queries/useAdminDashboard";
import {useAdminUsers} from "../../../hooks/queries/useAdminUsers";

import styles from "./AdminSearchPage.module.css";

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
  const [searchParams] = useSearchParams();
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

  const eventColumns: TableColumnsType<AdminEvent> = [
    {
      title: "Event",
      key: "title",
      render: (_, record) => (
        <div className={styles.eventCell}>
          <AdminEventImage
            imageUrl={record.imageUrl}
            alt=""
            className={styles.thumbnail}
          />
          <span>{record.title}</span>
        </div>
      ),
    },
    {title: "Date", dataIndex: "date", key: "date", responsive: ["md"]},
    {title: "Category", dataIndex: "category", key: "category", responsive: ["md"]},
    {title: "Location", dataIndex: "location", key: "location", responsive: ["md"]},
  ];

  const userColumns: TableColumnsType<AdminUser> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <div className={styles.userCell}>
          <img src={record.avatarUrl} alt="" className={styles.avatar} />
          <span>{record.name}</span>
        </div>
      ),
    },
    {title: "Email", dataIndex: "email", key: "email", responsive: ["md"]},
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
                  columns={eventColumns}
                  dataSource={events}
                  rowKey="id"
                  pagination={{pageSize: 8}}
                  scroll={{x: "max-content"}}
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
                  columns={userColumns}
                  dataSource={filteredUsers}
                  rowKey="id"
                  pagination={{pageSize: 8}}
                  scroll={{x: "max-content" }}
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
    </>
  );
}

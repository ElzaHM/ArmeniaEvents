import {Button, Switch, Table, Tag, message} from "antd";
import type {TableColumnsType} from "antd";
import {PlusOutlined} from "@ant-design/icons";

import AdminCard from "../../../components/admin/AdminCard";
import AdminPageHeader from "../../../components/admin/AdminPageHeader";
import type {AdminCategory} from "../../../components/admin/types";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../../../hooks/queries/useCategories";

import styles from "./AdminCategoriesPage.module.css";

export default function AdminCategoriesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const {data: categoriesData = [], isLoading} = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories: AdminCategory[] = categoriesData.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.name.toLowerCase().replace(/\s+/g, "-"),
    eventCount: category.eventCount,
    description: `${category.name} events`,
    isActive: true,
  }));

  const columns: TableColumnsType<AdminCategory> = [
    {title: "Name", dataIndex: "name", key: "name"},
    {title: "Slug", dataIndex: "slug", key: "slug", responsive: ["md"]},
    {
      title: "Events",
      dataIndex: "eventCount",
      key: "eventCount",
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["lg"],
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
    {
      title: "Enabled",
      key: "toggle",
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          size="small"
          loading={updateCategory.isPending}
          onChange={async (checked) => {
            try {
              await updateCategory.mutateAsync({
                id: record.id,
                payload: {is_active: checked},
              });
              messageApi.success("Category updated");
            } catch (error) {
              messageApi.error(error instanceof Error ? error.message : "Update failed");
            }
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          size="small"
          className="admin-btn-delete"
          onClick={async () => {
            try {
              await deleteCategory.mutateAsync(record.id);
              messageApi.success("Category deleted");
            } catch (error) {
              messageApi.error(error instanceof Error ? error.message : "Delete failed");
            }
          }}>
          Delete
        </Button>
      ),
    },
  ];

  const handleCreate = async () => {
    const name = `Category ${new Date().toLocaleTimeString()}`;
    try {
      await createCategory.mutateAsync({
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: `${name} description`,
        is_active: true,
        event_count: 0,
        icon: "bulb",
      });
      messageApi.success("Category created");
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  return (
    <>
      {contextHolder}
      <AdminPageHeader title="Categories" subtitle="Organize events into meaningful categories." />
      <AdminCard>
        <div className={styles.toolbar}>
          <Button
            type="primary"
            className="admin-btn-add"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            loading={createCategory.isPending}>
            Add Category
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            loading={isLoading || deleteCategory.isPending}
            pagination={{pageSize: 8}}
            scroll={{x: "max-content"}}
          />
        </div>
      </AdminCard>
    </>
  );
}

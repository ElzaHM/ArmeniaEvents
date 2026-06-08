import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Space, Switch, Table, Tag, message } from 'antd';
import type { TableColumnsType } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import type { AdminCategory } from '../../../components/admin/types';
import AdminCategoryModal from './AdminCategoryModal';
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
  type CategoryFormPayload,
} from './categoryApi';

import styles from './AdminCategoriesPage.module.css';

const adminCategoriesQueryKey = ['admin', 'categories'] as const;

export default function AdminCategoriesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: categoriesData = [], isLoading } = useQuery({
    queryKey: adminCategoriesQueryKey,
    queryFn: fetchAdminCategories,
  });

  useEffect(() => {
    setCategories(categoriesData);
  }, [categoriesData]);

  const refreshCategories = async () => {
    await queryClient.invalidateQueries({ queryKey: adminCategoriesQueryKey });
  };

  const createMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: (createdCategory) => {
      setCategories((current) =>
        [...current, createdCategory].sort((left, right) => left.name.localeCompare(right.name)),
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryFormPayload> }) =>
      updateAdminCategory(id, payload),
    onSuccess: (updatedCategory) => {
      setCategories((current) =>
        current
          .map((category) => (category.id === updatedCategory.id ? updatedCategory : category))
          .sort((left, right) => left.name.localeCompare(right.name)),
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: (_, deletedId) => {
      setCategories((current) => current.filter((category) => category.id !== deletedId));
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: AdminCategory) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (values: CategoryFormPayload) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          payload: values,
        });
        messageApi.success('Category updated');
      } else {
        await createMutation.mutateAsync(values);
        messageApi.success('Category created');
      }

      closeModal();
      await refreshCategories();
    } catch (error) {
      messageApi.error(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const handleToggleStatus = async (category: AdminCategory, checked: boolean) => {
    setTogglingId(category.id);
    setCategories((current) =>
      current.map((item) =>
        item.id === category.id ? { ...item, isActive: checked } : item,
      ),
    );

    try {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: { isActive: checked },
      });
      messageApi.success('Category updated');
      await refreshCategories();
    } catch (error) {
      setCategories((current) =>
        current.map((item) =>
          item.id === category.id ? { ...item, isActive: !checked } : item,
        ),
      );
      messageApi.error(error instanceof Error ? error.message : 'Update failed');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteCategory = (category: AdminCategory) => {
    Modal.confirm({
      title: 'Delete category?',
      content: `This will permanently delete "${category.name}".`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(category.id);
          messageApi.success('Category deleted');
          await refreshCategories();
        } catch (error) {
          messageApi.error(error instanceof Error ? error.message : 'Delete failed');
        }
      },
    });
  };

  const columns: TableColumnsType<AdminCategory> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug', responsive: ['md'] },
    {
      title: 'Events',
      dataIndex: 'eventCount',
      key: 'eventCount',
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['lg'],
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Active' : 'Disabled'}</Tag>
      ),
    },
    {
      title: 'Enabled',
      key: 'toggle',
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          size="small"
          loading={togglingId === record.id}
          onChange={(checked) => {
            void handleToggleStatus(record, checked);
          }}
          onClick={(_, event) => event.stopPropagation()}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" onClick={(event) => event.stopPropagation()}>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            className={`admin-btn-edit ${styles.editButton}`}
            onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            className="admin-btn-delete"
            onClick={() => handleDeleteCategory(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
            onClick={openCreateModal}>
            Add Category
          </Button>
        </div>
        <div className={styles.tableWrap}>
          <Table
            columns={columns}
            dataSource={categories}
            rowKey="id"
            loading={isLoading || deleteMutation.isPending}
            onRow={(record) => ({
              onClick: () => openEditModal(record),
              className: 'admin-table-row-clickable',
            })}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </AdminCard>

      <AdminCategoryModal
        open={modalOpen}
        category={editingCategory}
        onClose={closeModal}
        onSave={handleSaveCategory}
        saving={isSaving}
      />
    </>
  );
}

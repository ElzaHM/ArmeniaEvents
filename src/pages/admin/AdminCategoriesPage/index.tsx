import { useEffect, useState, type ComponentType } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Space, Switch, Table, Tag, message } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  BookOutlined,
  ProjectOutlined,
  CodeOutlined,
  CoffeeOutlined,
  DeleteOutlined,
  EditOutlined,
  ExperimentOutlined,
  FolderOutlined,
  HeartOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import AdminCard from '../../../components/admin/AdminCard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import type { AdminCategory } from '../../../components/admin/types';
import AdminCategoryModal from './AdminCategoryModal';
import {
  adminCategoriesQueryKey,
  invalidateAdminCategoryRelatedCaches,
} from '../AdminEventsPage/eventCategories';
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
  type CategoryFormPayload,
} from './categoryApi';

import styles from './AdminCategoriesPage.module.css';

type CategoryIconProps = {
  className?: string;
  style?: React.CSSProperties;
};

const CATEGORY_ICON_MAP: Record<string, ComponentType<CategoryIconProps>> = {
  Science: ExperimentOutlined,
  Education: BookOutlined,
  Lifestyle: SmileOutlined,
  'Food & Drink': CoffeeOutlined,
  Art: PictureOutlined,
  Entertainment: PlayCircleOutlined,
  Business: ProjectOutlined,
  Tech: CodeOutlined,
  Society: TeamOutlined,
  Family: HeartOutlined,
};

function getCategoryIcon(name: string): ComponentType<CategoryIconProps> {
  return CATEGORY_ICON_MAP[name] ?? FolderOutlined;
}

export default function AdminCategoriesPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [viewingCategory, setViewingCategory] = useState<AdminCategory | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: categoriesData = [], isLoading } = useQuery({
    queryKey: adminCategoriesQueryKey,
    queryFn: fetchAdminCategories,
  });
  const totalCategories = categories.length;

  useEffect(() => {
    setCategories(categoriesData);
  }, [categoriesData]);

  const refreshCategories = async () => {
    await invalidateAdminCategoryRelatedCaches(queryClient);
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

  const openDetailModal = (category: AdminCategory) => {
    setViewingCategory(category);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
    setViewingCategory(null);
  };

  const openEditModal = (category: AdminCategory) => {
    closeDetailModal();
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
      content: `This will permanently delete "${category.name}". Events in this category will become uncategorized.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(category.id);
          closeDetailModal();
          messageApi.success('Category deleted');
          await refreshCategories();
        } catch (error) {
          messageApi.error(error instanceof Error ? error.message : 'Delete failed');
        }
      },
    });
  };

  const columns: TableColumnsType<AdminCategory> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => {
        const Icon = getCategoryIcon(name);

        return (
          <Space size={8} align="center">
            <Icon
              aria-hidden
              style={{ color: 'var(--admin-gold)', fontSize: 16, flexShrink: 0 }}
            />
            <span>{name}</span>
          </Space>
        );
      },
    },
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
      width: 380,
      responsive: ['lg'],
      render: (description: string) => (
        <span className={styles.descriptionClamp}>{description}</span>
      ),
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
            className="admin-btn-edit"
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
      <div className={styles.totalCategoriesBadge} aria-live="polite">
        <span className={styles.totalCategoriesLabel}>Total categories</span>
        <strong className={styles.totalCategoriesCount}>
          {isLoading ? '…' : totalCategories.toLocaleString('en-US')}
        </strong>
      </div>
      <AdminCard className={styles.adminTableCard}>
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
            size="middle"
            columns={columns}
            dataSource={categories}
            rowKey="id"
            loading={isLoading || deleteMutation.isPending}
            onRow={(record) => ({
              onClick: () => openDetailModal(record),
              className: 'admin-table-row-clickable',
            })}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              hideOnSinglePage: true,
            }}
            scroll={{ x: 'max-content' }}
            styles={{
              content: {
                overflowY: 'visible',
                maxHeight: 'none',
                height: 'auto',
              },
              body: {
                wrapper: {
                  overflowY: 'visible',
                  maxHeight: 'none',
                  height: 'auto',
                },
              },
            }}
          />
        </div>
      </AdminCard>

      <Modal
        open={detailModalOpen}
        title={null}
        footer={null}
        onCancel={closeDetailModal}
        className="admin-detail-modal"
        width={560}
        centered
        destroyOnHidden>
        {viewingCategory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <header style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {(() => {
                  const Icon = getCategoryIcon(viewingCategory.name);
                  return (
                    <Icon
                      aria-hidden
                      style={{ color: 'var(--admin-gold)', fontSize: 22, flexShrink: 0 }}
                    />
                  );
                })()}
                <h2
                  style={{
                    margin: 0,
                    fontSize: 24,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: 'var(--admin-text)',
                    wordBreak: 'break-word',
                  }}>
                  {viewingCategory.name}
                </h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Tag color={viewingCategory.isActive ? 'success' : 'default'}>
                  {viewingCategory.isActive ? 'Active' : 'Disabled'}
                </Tag>
                <Tag color="gold">{viewingCategory.eventCount.toLocaleString()} events</Tag>
              </div>
            </header>

            <section className={styles.detailSection}>
              <dl style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: 0 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px 1fr',
                    gap: 10,
                    alignItems: 'start',
                  }}>
                  <dt
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--admin-text-muted)',
                    }}>
                    Slug
                  </dt>
                  <dd style={{ margin: 0, color: 'var(--admin-text)', wordBreak: 'break-word' }}>
                    {viewingCategory.slug}
                  </dd>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px 1fr',
                    gap: 10,
                    alignItems: 'start',
                  }}>
                  <dt
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--admin-text-muted)',
                    }}>
                    Status
                  </dt>
                  <dd style={{ margin: 0, color: 'var(--admin-text)' }}>
                    {viewingCategory.isActive ? 'Enabled' : 'Disabled'}
                  </dd>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px 1fr',
                    gap: 10,
                    alignItems: 'start',
                  }}>
                  <dt
                    style={{
                      margin: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--admin-text-muted)',
                    }}>
                    Events
                  </dt>
                  <dd style={{ margin: 0, color: 'var(--admin-text)' }}>
                    {viewingCategory.eventCount.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </section>

            {viewingCategory.description ? (
              <section>
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--admin-text-muted)',
                  }}>
                  Description
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: 'var(--admin-text-secondary)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                  {viewingCategory.description}
                </p>
              </section>
            ) : null}

            <footer
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                marginTop: 4,
                paddingTop: 16,
                borderTop: '1px solid var(--admin-border)',
              }}>
              <Button
                danger
                className="admin-btn-delete"
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteCategory(viewingCategory)}>
                Delete
              </Button>
              <Button
                type="primary"
                className="admin-btn-edit"
                icon={<EditOutlined />}
                onClick={() => openEditModal(viewingCategory)}>
                Edit
              </Button>
            </footer>
          </div>
        ) : null}
      </Modal>

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

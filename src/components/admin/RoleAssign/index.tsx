'use client';
import { FC, useEffect, useState, ReactElement, useCallback } from 'react';
import { YStack, Text, XStack, Button, ScrollView } from 'tamagui';
import Modal from '../../appComponets/modal/PopupModal';
import { ServiceErrorManager } from '@/helpers/service';
import { UpdateUserRolesService, UserAdminsListService } from '@/services/auth';
import { Column } from 'react-table';
import { IUser } from '@/types/auth';
import { RiEdit2Fill } from 'react-icons/ri';
import { NewTableHOC } from '../organism/TableHOC';
import { useDarkMode } from '@/hook/useDarkMode';
import { Tag } from '../../appComponets/tag/Tag';
import { TbTrash } from 'react-icons/tb';
import { startCase } from 'lodash-es';
import SendInvitation from './SendInvitation';
import { permissions } from '@/constant/permissions';
import usePermission from '@/hook/usePermission';
import { usePagination } from '@/hook/usePagination';

interface DataType {
  _id: string;
  name: ReactElement;
  email: ReactElement;
  phone: string;
  roles: ReactElement;
  action: ReactElement;
}

const RoleAssign: FC = () => {
  const { hasPermission } = usePermission();
  const isDark = useDarkMode();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<Array<string>>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [confirmDeleteRole, setConfirmDeleteRole] = useState<string | null>(
    null
  );

  const fetchAdmisList = useCallback(
    async (page: number, limit: number, search: string) => {
      const [err, data] = await ServiceErrorManager(
        UserAdminsListService({
          data: {
            options: {
              page,
              limit,
            },
            query: {
              searchFields: ['name', 'email', 'phone'],
              search,
            },
          },
        }),
        {}
      );
      if (err || !data) return;
      return data;
    },
    []
  );

  const {
    state: { loading, items: users },
    action,
    paginationProps,
  } = usePagination<IUser>({
    fetchFunction: fetchAdmisList,
  });

  const columns: Column<DataType>[] = [
    {
      id: 'name',
      Header: 'Name',
      accessor: 'name',
    },
    {
      id: 'email',
      Header: 'Email',
      accessor: 'email',
    },
    {
      id: 'phone',
      Header: 'Phone',
      accessor: 'phone',
    },
    {
      id: 'roles',
      Header: 'Roles',
      accessor: 'roles',
    },
    ...(hasPermission(permissions.CAN_REMOVE_ROLES)
      ? [
          {
            id: 'action',
            Header: 'Action',
            accessor: 'action' as const,
          },
        ]
      : []),
  ];

  const statusColorMap: Record<string, any> = {
    admin: 'yellow',
    seller: 'green',
    customer: 'orange',
    superAdmin: 'red',
  };

  const formatRoleDisplay = (role: string): string => {
    if (role === 'superAdmin') return 'Super Admin';
    return startCase(role);
  };
  const rows: DataType[] = users?.map((user) => ({
    _id: user?._id,
    name: <Text>{user.name}</Text>,
    email: <Text>{user.email}</Text>,
    phone: user?.phone || '',
    roles: (
      <XStack flexWrap='wrap' gap='$2'>
        {user.roles.map((role) => (
          <Tag
            style={{ borderRadius: 2, height: 20 }}
            textProps={{
              fontSize: '$3',
              textTransform: 'uppercase',
              borderRadius: 0,
            }}
            key={role}
            colorScheme={statusColorMap[role]}
          >
            {formatRoleDisplay(role)}
          </Tag>
        ))}
      </XStack>
    ),
    action: (
      <Button
        icon={<RiEdit2Fill size={16} />}
        chromeless
        onPress={() => handleEditUser(user)}
      />
    ),
  }));

  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setRoles([...user.roles]);
    setEditModalOpen(true);
  };

  const handleRemoveRole = (roleToRemove: string) => {
    if (roleToRemove === 'admin') {
      setConfirmDeleteRole(roleToRemove);
    } else {
      setRoles(roles.filter((role) => role !== roleToRemove));
    }
  };

  const confirmRemoveRole = () => {
    if (confirmDeleteRole) {
      setRoles(roles.filter((role) => role !== confirmDeleteRole));
      setConfirmDeleteRole(null);
    }
  };

  const saveUserRoles = () => {
    if (!selectedUser || !selectedUser?._id) return;
    setIsSaving(true);
    ServiceErrorManager(
      UpdateUserRolesService({
        data: {
          query: { _id: selectedUser._id },
          payload: { roles: roles },
        },
      }),
      { successMessage: 'User roles updated successfully' }
    )
      .then(() => {
        setEditModalOpen(false);
        action.refresh();
      })
      .catch(console.error)
      .finally(() => setIsSaving(false));
  };

  return (
    <YStack>
      <SendInvitation />
      <Modal
        title={`Edit Roles for ${selectedUser?.name || 'User'}`}
        confirmText='Save Changes'
        width={450}
        onConfirm={saveUserRoles}
        isLoading={isSaving}
        confirmButtonProps={{
          backgroundColor: '$primary',
          disabled: isSaving || roles.length === 0,
        }}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setConfirmDeleteRole(null);
        }}
      >
        <YStack space='$4' padding='$2'>
          <YStack space='$2'>
            <Text fontWeight='bold'>Current Roles</Text>

            {roles.length === 0 ? (
              <Text color='$gray10'>No roles assigned</Text>
            ) : (
              <XStack flexWrap='wrap' gap='$2'>
                {roles.map((role) => (
                  <XStack
                    key={role}
                    backgroundColor={isDark ? '$gray3' : '$gray2'}
                    padding='$2'
                    borderRadius='$4'
                    alignItems='center'
                    justifyContent='space-between'
                    width='100%'
                  >
                    <Text>{role}</Text>
                    <Button
                      size='$2'
                      circular
                      icon={
                        <TbTrash
                          color={isDark ? '#ff6b6b' : '#e03131'}
                          size={16}
                        />
                      }
                      chromeless
                      onPress={() => handleRemoveRole(role)}
                    />
                  </XStack>
                ))}
              </XStack>
            )}
          </YStack>

          {confirmDeleteRole && (
            <YStack
              backgroundColor={isDark ? '$red2' : '$red1'}
              padding='$3'
              borderRadius='$4'
              borderColor='$red6'
              borderWidth={1}
              space='$3'
            >
              <Text fontWeight='bold' color='$red9'>
                Confirm Role Removal
              </Text>
              <Text>
                Are you sure you want to remove the
                <Text fontWeight='bold'>{confirmDeleteRole}</Text> role? This
                may impact user permissions significantly.
              </Text>
              <XStack justifyContent='flex-end' space='$2'>
                <Button
                  size='$3'
                  backgroundColor='$gray5'
                  onPress={() => setConfirmDeleteRole(null)}
                >
                  Cancel
                </Button>
                <Button
                  size='$3'
                  backgroundColor='$red9'
                  onPress={confirmRemoveRole}
                >
                  Remove Role
                </Button>
              </XStack>
            </YStack>
          )}
        </YStack>
      </Modal>

      <ScrollView>
        <NewTableHOC
          isLoading={loading}
          onSearch={(e) => action.handleOnSearch(e, 600)}
          pageSize={paginationProps.pageSize}
          isDark={isDark}
          columns={columns}
          data={rows}
          title='Admins'
          pagination={true}
          filtering={true}
          variant={isDark ? 'default' : 'striped'}
          emptyMessage='No admins found'
          serverSidePagination={paginationProps}
        />
      </ScrollView>
    </YStack>
  );
};

export default RoleAssign;

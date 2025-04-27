import Service from '@/helpers/service';

export const GoogleLoginService = Service('/auth/login-email');

export const UserSwitchRoleService = Service('/auth/user/switch-role');

export const TokenVerificationService = Service('/auth/token/verify');

export const MakeAdminAndSuperAdmin = Service('/auth/users/roles/update');

export const UserAdminsListService = Service('/auth/users/admins/list');

export const UpdateUserRolesService = Service('/auth/users/roles/remove');

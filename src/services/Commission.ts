import Service from '@/helpers/service';

export const CreateCommissionConfigService = Service(
  '/commission/config/create'
);

export const UpdatedCommissionConfigService = (id: string) =>
  Service(`/commission/config/update/${id}`, { method: 'PUT' });

export const ListCommissionConfigService = Service('/commission/config/list');

export const GetCommissionConfig = (id: string) =>
  Service(`/commission/config/get/${id}`, { method: 'GET' });

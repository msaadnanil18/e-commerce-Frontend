import Service from '@/helpers/service';

export const CreateServiceChargeService = Service('/service-charges/create');

export const UpdateServiceChargeService = (id: string) =>
  Service(`/service-charges/update/${id}`, { method: 'PUT' });

export const ListServiceCharges = Service('/service-charges/list', {
  method: 'GET',
});

export const GetServiceCharge = (id: string) =>
  Service(`/service-charges/get/${id}`, { method: 'GET' });

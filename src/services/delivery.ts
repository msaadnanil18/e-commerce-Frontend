import Service from '@/helpers/service';

export const CreateDeliveryZoneService = Service('/delivery-zone/create');

export const UpdateDeliveryZoneService = (id: string) =>
  Service(`/delivery-zone/update/${id}`, {
    method: 'PUT',
  });

export const ListDeliveryZoneService = Service('/delivery-zones/list');

export const GetDeliveryZoneService = (id: string) =>
  Service(`/delivery-zones/get/${id}`, {
    method: 'GET',
  });

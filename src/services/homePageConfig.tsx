import Service from '@/helpers/service';

export const CreateHomePageConfigService = Service('/home-page/config/create');

export const UpdateHomePageConfigService = (id: string) =>
  Service(`/home-page/config/update/${id}`, { method: 'PUT' });

export const GetHomePageConfigService = (id: string) =>
  Service(`/home-page/config/get/${id}`, { method: 'GET' });

export const ListHomePageConfigService = Service('/home-page/config/list');

export const ListAnonymousHomePageConfigService = Service(
  '/home-page/config/anonymous/list'
);

import Service from '@/helpers/service';

export const AddNewReviewService = Service('/review/add');

export const ListReviewService = (id: string) =>
  Service(`/review/list/${id}`, { method: 'GET' });

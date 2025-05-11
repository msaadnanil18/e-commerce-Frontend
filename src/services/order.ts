import Service from '@/helpers/service';

export const CreateNewOrderService = Service('/order/create');

export const GetOrdersBySellerService = Service('/order/seller/list');

export const GetOrdersByCustomerService = Service('/order/customer/list');

export const UpdateOrderItemStatusService = Service(
  '/order/seller/update-status'
);

export const GenerateCustomerOrderBillService = Service(
  '/order/customer/generate-bill'
);

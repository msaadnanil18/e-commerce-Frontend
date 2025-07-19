import Service from '@/helpers/service';

export const CreateNewOrderService = Service<
  any,
  {
    cartId: string;
    shippingAddressId: string;
    paymentMethod: string;
    billingAddressId?: string;
    notes?: string;
  }
>('/order/create');

export const ListOrdersBySellerService = Service('/order/seller/list');

export const ListOrdersByCustomerService = Service('/order/customer/list');

export const UpdateOrderItemStatusService = Service(
  '/order/seller/update-status'
);

export const GenerateCustomerOrderBillService = Service(
  '/order/customer/generate-bill'
);

export const GetOrderDetailsService = (orderId: string) =>
  Service(`/order/get/${orderId}`, { method: 'GET' });

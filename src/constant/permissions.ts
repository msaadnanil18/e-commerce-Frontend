export const permissions = Object.freeze({
  /* SELLER PERMISSION */
  CAN_APPROVE_SELLER: 'approve_sellers',
  CAN_MANAGE_SELLER: 'manage_seller',
  CAN_VIEW_SELLER_LIST: 'can_view_seller_list',
  /* SELLER PERMISSION */

  /* PRODUCT PERMISSION */
  CAN_ADD_PRODUCT: 'can_add_products',
  CAN_VIEW_PRODUCT: 'can_view_product',
  CAN_VIEW_PRODUCT_LIST: 'view_product_list',
  CAN_MANAGE_PRODUCTS: 'manage_products',
  CAN_APPROVE_PRODUCT: 'approve_product',
  VIEW_PRODUCTS: 'view_products',
  /* PRODUCT PERMISSION */

  CAN_VIEW_ANALYTICS: 'view_analytics',
  CAN_MANAGE_USERS: 'manage_users',
  CAN_PROCESS_REFUNDS: 'process_refunds',

  CAN_VIEW_CART: 'can_view_cart',
  CAN_ADD_PRODUCT_CART: 'can_add_product_cart',

  /* ORDER */
  CAN_VIEW_ORDERS: 'view_orders',
  CAN_PLACE_ORDER: 'place_order',
  CAN_TRACK_ORDER: 'track_order',
  CAN_CANCEL_ORDER: 'cancel_order',
  /* ORDER */

  CAN_WRITE_REVIEW: 'write_review',
  CAN_EDIT_REVIEW: 'edit_review',

  CAN_VIEW_DISCOUNTS: 'view_discounts',
  CAN_MANAGE_INVENTORY: 'manage_inventory',
  CAN_SET_DISCOUNTS: 'set_discounts',
  CAN_VIEW_SALES_REPORT: 'view_sales_report',
  CAN_MANAGE_DISCOUNTS: 'manage_discounts',
  CAN_GENERATE_REPORTS: 'generate_reports',

  CAN_VIEW_ADMIN_AND_SUPER_ADMIN_LIST: 'can_view_admin_and_super_admin_list',
  CAN_SEND_INVITATION_LINK_ADMIN_SUPER_ADMIN:
    'can_send_invitation_link_admin_and_super_admin',
  CAN_REMOVE_ROLES: 'can_remove_roles',

  CAN_VIEW_DELIVERY_ZONE: 'can_view_delivery_zone_list',
  CAN_MANAGE_DELIVERY_ZONE: 'can_manage_delivery_zone',
  CAN_CREATE_DELIVERY_ZONE: 'can_create_delivery_zone',

  CAN_CREATE_SERVICE_CHARGE: 'can_create_service_charge',
  CAN_VIEW_SERVICE_CHARGE: 'can_view_service_charge',
  CAN_MANAGE_SERVICE_CHARGE: 'can_manage_service_charge',

  /* COMMISSION CONFIGURATION */
  CAN_MANAGE_COMMISSION_CONFIGURATION: 'can_manage_commission configuration',
  CAN_CREATE_COMMISSION_CONFIGURATION: 'can_create_commission configuration',
  CAN_VIEW_COMMISSION_CONFIGURATION: 'can_view_commission configuration',
  /* COMMISSION CONFIGURATION */

  CAN_SELLER_REGISTERED: 'can_seller_registered',

  /* HOME PAGE */
  CAN_CREATE_HOME_PAGE_CONFIG: 'can_create_home_page_config',
  CAN_VIEW_HOME_PAGE_CONFIG: 'can_view_home_page_config',
  CAN_MANAGE_HOME_PAGE_CONFIG: 'can_manage_home_page_config',
  /* HOME PAGE */

  /*PRODUCT CATEGORY */
  CAN_VIEW_PRODUCT_CATEGORY_LIST: 'can_view_product_category_list',
  CAN_VIEW_PRODUCT_CATEGORY: 'can_view_product_category',
  CAN_ADD_PRODUCT_CATEGORY: 'can_add_product_category',
  CAN_DELETE_PRODUCT_CATEGORY: 'can_delete_product_category',
  CAN_MANAGE_PRODUCT_CATEGORY: 'can_manage_product_category',
  /*PRODUCT CATEGORY */
});

export const ProtectedRoutes: Record<string, string[]> = Object.freeze({
  '/cart': [permissions.CAN_VIEW_CART],

  /* Account */
  '/account/wishlist': [],
  /* Account */
  '/seller/seller-registration': [permissions.CAN_SELLER_REGISTERED],
  // '/seller/refill': [],

  '/admin/dashboard': [],

  /* CONFIG */
  '/admin/config/commission': [permissions.CAN_VIEW_COMMISSION_CONFIGURATION],
  '/admin/config/commission/create': [
    permissions.CAN_CREATE_COMMISSION_CONFIGURATION,
  ],
  '/admin/config/commission/update': [
    permissions.CAN_MANAGE_COMMISSION_CONFIGURATION,
  ],
  '/admin/config/service-charge': [permissions.CAN_VIEW_SERVICE_CHARGE],
  '/admin/config/service-charge/create': [
    permissions.CAN_CREATE_SERVICE_CHARGE,
  ],
  '/admin/config/service-charge/update': [
    permissions.CAN_MANAGE_SERVICE_CHARGE,
  ],
  '/admin/config/delivery-zone': [permissions.CAN_VIEW_DELIVERY_ZONE],
  '/admin/config/delivery-zone/create': [permissions.CAN_CREATE_DELIVERY_ZONE],

  '/admin/config/delivery-zone/update': [permissions.CAN_MANAGE_DELIVERY_ZONE],

  '/admin/config/home-page': [permissions.CAN_VIEW_HOME_PAGE_CONFIG],

  '/admin/config/category': [permissions.CAN_VIEW_PRODUCT_CATEGORY],

  /* CONFIG */

  '/admin/role-assign': [permissions.CAN_VIEW_ADMIN_AND_SUPER_ADMIN_LIST],

  /* Seller */
  '/admin/seller': [permissions.CAN_VIEW_SELLER_LIST],
  '/admin/seller/seller-details': [],
  /* Seller */

  /* Product */
  '/admin/product': [permissions.CAN_VIEW_PRODUCT],
  '/admin/product/create': [permissions.CAN_ADD_PRODUCT],
  /* Product */

  /* ORDERS */
  '/admin/orders': [permissions.CAN_VIEW_ORDERS],
  /* ORDERS */
});

import Service from '@/helpers/service';

export const SellerRegistrationService = Service('/seller/registered');

export const SellerListService = Service('/seller/list');

export const ApproveRejectSellerService = Service('/seller/approve-reject');

export const GetSellerDetailsService = Service('/seller/get');

export const SubmitSellerRefillService = Service('/seller/registered/refil');

export const GetSellerRefillDetails = Service('/seller/refil/get');

'use client';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { merge } from 'lodash-es';
import toast from 'react-hot-toast';
import { MdOutlineCancel } from 'react-icons/md';

export interface ServiceOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig<Partial<T>>;
}

export type ServiceHelper<Res, ReqData> = (
  config?: AxiosRequestConfig<ReqData>
) => Promise<AxiosResponse<Res>>;
export const Service =
  <Res = any, ReqData = any>(
    url: string,
    options?: ServiceOptions<ReqData>
  ): ServiceHelper<Res, ReqData> =>
  (reqConf) => {
    const config = merge(options?.config || {}, reqConf);
    return axios<Res>({
      url,
      method: options?.method || 'POST',
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      withCredentials: true,
      ...(config || {}),
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          typeof window !== 'undefined'
            ? `Bearer ${localStorage.getItem('sessionToken')}`
            : 'Bearer',
        ...(config?.headers || {}),
      },
    });
  };

export const isServiceError = (e: AxiosError<any>) =>
  e.response?.data && e.response.data.error;
export const handleError = (message?: string | null) => (e: unknown) => {
  let description: string;

  if (isServiceError(e as AxiosError<any>) && (e as AxiosError<any>).response) {
    const responseData = (e as AxiosError<any>).response?.data;

    if (responseData.exceptions && Array.isArray(responseData.exceptions)) {
      description = responseData.exceptions
        .map(
          (exception: { message?: string; code?: string }) =>
            exception.message || exception.code
        )
        .join(', ');
    } else {
      description =
        responseData.message ||
        responseData.error ||
        'An unknown error occurred';
    }
  } else {
    description = 'An unknown error occurred';
  }

  toast.error(message || description || 'Something went wrong');
};

interface ServiceManagerOptions {
  failureMessage?: string | null;
  successMessage?: string | null;
}

export const ServiceErrorManager = async <T = any,>(
  service: Promise<
    AxiosResponse<T> | { data: T | null; error: unknown | null }
  >,
  { successMessage, failureMessage }: ServiceManagerOptions
): Promise<any> => {
  try {
    const { data } = await service;
    if (data && successMessage) {
      toast.success(successMessage);
      // toast.custom((t) => (
      //   <div
      //     className={`${
      //       t.visible ? 'animate-enter' : 'animate-leave'
      //     } max-w-md w-full pointer-events-auto`}
      //   >
      //     <div
      //       className={`
      //     relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm
      //     ${'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}
      //     hover:shadow-xl transition-shadow duration-200
      //   `}
      //     >
      //       {/* Progress bar for timed toasts */}
      //       <div
      //         className='absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl animate-pulse'
      //         style={{
      //           animation: `shrink ${2}ms linear forwards`,
      //         }}
      //       />

      //       <div className='flex items-start p-4'>
      //         <div className='flex-shrink-0 mr-3'>o</div>

      //         <div className='flex-grow min-w-0'>
      //           <div className='font-semibold text-gray-900 text-sm leading-5'>
      //             {'Sucess'}
      //           </div>
      //           <div className='text-gray-600 text-sm mt-1 leading-4'>
      //             {successMessage}
      //           </div>
      //         </div>

      //         <button
      //           onClick={() => toast.dismiss(t.id)}
      //           className='flex-shrink-0 ml-3 p-1 rounded-full hover:bg-gray-100 transition-colors duration-150'
      //         >
      //           <MdOutlineCancel className='w-4 h-4 text-gray-400 hover:text-gray-600' />
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // ));
    }
    return [null, data];
  } catch (e) {
    handleError(failureMessage)(e);
    return [String(e), null];
  }
};

export default Service;

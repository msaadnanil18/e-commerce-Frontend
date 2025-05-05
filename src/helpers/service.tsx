'use client';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { merge } from 'lodash-es';
import toast from 'react-hot-toast';

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
    }
    return [null, data];
  } catch (e) {
    handleError(failureMessage)(e);
    return [String(e), null];
  }
};

export default Service;

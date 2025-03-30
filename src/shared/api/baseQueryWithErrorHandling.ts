import { BaseQueryFn, FetchArgs, FetchBaseQueryError, fetchBaseQuery } from '@reduxjs/toolkit/query';
import { enqueueSnackbar } from 'notistack';
import { ROUTES } from '../constants/routes';
import Cookies from 'js-cookie';

const customFetchBaseQuery = fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL });

export const baseQueryWithErrorHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const token = Cookies.get('authToken');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  let result;
  if (typeof args === 'string') {
    result = await customFetchBaseQuery(args, api, extraOptions);
  } else {
    result = await customFetchBaseQuery(
      { ...args, headers: { ...args.headers, ...authHeader } },
      api,
      extraOptions
    );
  }
  if (result.error) {
    if (result.error.status === 401) {
      window.location.href = ROUTES.LOGIN;
    }
    const errorMessage = (result.error.data as { message?: string })?.message || 'An error occurred';
    enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' });
  }
  return result;
};

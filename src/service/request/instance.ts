import axios from 'axios';
import type {AxiosError, AxiosInstance, AxiosRequestConfig} from 'axios';
import {REFRESH_TOKEN_CODE} from '@/configs/service';
import {
  localStg,
  handleAxiosError,
  handleBackendError,
  handleResponseError,
  handleServiceResult,
  transformRequestData
} from '@/utils';
import {handleRefreshToken} from './helpers';
import {useAuthStore} from "@/store";

export default class CustomAxiosInstance {
  instance: AxiosInstance;

  backendConfig: Service.BackendResultConfig;

  constructor(
    axiosConfig: AxiosRequestConfig,
    backendConfig: Service.BackendResultConfig = {
      codeKey: 'code',
      dataKey: 'data',
      msgKey: 'message',
      successCode: 200
    }
  ) {
    this.backendConfig = backendConfig;
    this.instance = axios.create(axiosConfig);
    this.setInterceptor();
  }

  setInterceptor() {
    this.instance.interceptors.request.use(
      async config => {
        const handleConfig = {...config};
        if (handleConfig.headers) {
          const contentType = handleConfig.headers['Content-Type'] as string;
          handleConfig.data = await transformRequestData(handleConfig.data, contentType);
          handleConfig.headers.Authorization = 'Bearer ' + localStg.get('token') || '';
        }
        return handleConfig;
      },
      (axiosError: AxiosError) => {
        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
    this.instance.interceptors.response.use(
      async response => {
        const {status} = response;
        if (status === 200 || status < 300 || status === 304) {
          const backend = response.data;
          const {codeKey, dataKey, successCode} = this.backendConfig;
          if (backend[codeKey]) {
            if (backend[codeKey] === successCode) {
              return handleServiceResult(null, backend[dataKey]);
            }
          } else {
            return handleServiceResult(null, backend);
          }

          if (REFRESH_TOKEN_CODE.includes(backend[codeKey])) {
            const config = await handleRefreshToken(response.config);
            if (config) {
              return this.instance.request(config);
            }
          }

          const error = handleBackendError(backend, this.backendConfig);
          return handleServiceResult(error, null);
        }
        const error = handleResponseError(response);
        return handleServiceResult(error, null);
      },
      (axiosError: AxiosError) => {
        const {response} = axiosError;
        if (response) {
          const {status} = response;
          const auth = useAuthStore()
          if (status == 401) {
            auth.resetAuthStore()
          }
        }

        const error = handleAxiosError(axiosError);
        return handleServiceResult(error, null);
      }
    );
  }
}

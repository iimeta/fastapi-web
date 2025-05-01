import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  message: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    if (res instanceof Blob) {
      return response;
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message.error({
        content: res.message || 'Unknown Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if ([50008, 50012, 50014, 401, 403].includes(res.code)) {
        Modal.error({
          title: '会话超时',
          content: '会话超时, 请重新登录',
          okText: '重新登录',
          async onOk() {
            const userStore = useUserStore();
            if (userStore.role === 'reseller') {
              await userStore.logout();
              window.location.href = '/reseller';
            } else if (userStore.role === 'admin') {
              await userStore.logout();
              window.location.href = '/admin';
            } else {
              await userStore.logout();
              window.location.reload();
            }
          },
        });
      } else if (res.code === 9) {
        const userStore = useUserStore();
        if (userStore.role === 'admin') {
          setTimeout(() => {
            window.location.href = '/sys/license/info';
          }, 3000);
        }
      }
      return Promise.reject(new Error(res.message || 'Unknown Error'));
    }
    return res;
  },
  async (error) => {
    if ([401, 403].includes(error.response.status)) {
      if (error.config.url !== '/api/v1/user/info') {
        Message.error({
          content: '会话超时, 请重新登录',
          duration: 5 * 1000,
        });
      }

      const userStore = useUserStore();
      if (userStore.role === 'reseller') {
        await userStore.logout();
        window.location.href = '/reseller';
      } else if (userStore.role === 'admin') {
        await userStore.logout();
        window.location.href = '/admin';
      } else {
        await userStore.logout();
        window.location.reload();
      }
    } else {
      Message.error({
        content: error.message || 'Request Error',
        duration: 5 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

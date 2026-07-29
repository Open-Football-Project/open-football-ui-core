import axios, { AxiosInstance } from "axios";
import { serviceMockWrapper } from "./mock/mockWrapper";
import { serviceWrapper } from "./implementation";

interface ApiFetchConfig {
  apiHost: string;
  useMock: boolean;
}

let config: ApiFetchConfig | null = null;
let apiFetch: AxiosInstance | null = null;

const setApiFetchConfig = (apiConf: ApiFetchConfig) => {
  config = apiConf;
};

const initApiFetch = () => {
  apiFetch = axios.create({
    baseURL: config?.apiHost ?? "http://localhost:8080",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getApiFetch = (): AxiosInstance => {
  if (!apiFetch) {
    throw new Error("apiFetch not initialized.");
  }
  return apiFetch;
};

export const useApiService = (apiHost: string, useMock: boolean) => {
  if (useMock) {
    return serviceMockWrapper;
  }

  if (!apiFetch) {
    setApiFetchConfig({ apiHost, useMock });
    initApiFetch();
  }

  return serviceWrapper;
};

import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock("./mock/mockWrapper", () => ({
  serviceMockWrapper: { mock: true },
}));

vi.mock("./implementation", () => ({
  serviceWrapper: { real: true },
}));

import { useApiService, getApiFetch } from "./api-service";

describe("api-service module", () => {
  const fakeAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (axios.create as any).mockReturnValue(fakeAxiosInstance);
    vi.resetModules();
  });

  it("throws if getApiFetch is called before init", () => {
    expect(() => getApiFetch()).toThrow("apiFetch not initialized");
  });

  it("returns mock service when useMock is true", () => {
    const service = useApiService("http://api.test", true);
    expect(service).toEqual({ mock: true });
    expect(axios.create).not.toHaveBeenCalled();
  });

  it("initializes axios and returns real service when useMock is false", () => {
    const service = useApiService("http://api.test", false);

    expect(service).toEqual({ real: true });

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "http://api.test",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });

  it("getApiFetch returns axios instance after init", () => {
    useApiService("http://api.test", false);

    const api = getApiFetch();
    expect(api).toBe(fakeAxiosInstance);
  });
});

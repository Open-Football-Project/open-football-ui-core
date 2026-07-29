import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import axios from "axios";
import { bannersManager } from "./bannersManager";
import { BannerCountry, BannerSize } from "../../types/banners";
import { FootballProjectUIStorage } from "../../storage";

vi.mock("axios");
const mockedAxios = axios as unknown as { get: Mock };

describe("bannersManager", () => {
  let mockStorage: FootballProjectUIStorage & { stmap: Map<string, string> };
  const countryApiHost = "https://api.country.is";

  beforeEach(() => {
    const map = new Map<string, string>();
    mockStorage = {
      get: vi.fn((key: string) => Promise.resolve(map.get(key) ?? null)),
      set: vi.fn((key: string, value: string) => {
        map.set(key, value);
        return Promise.resolve();
      }),
      remove: vi.fn((key: string) => {
        map.delete(key);
        return Promise.resolve();
      }),
      stmap: map,
    };
    vi.resetAllMocks();
  });

  describe("getCountryCode", () => {
    it("returns cached country if present in storage", async () => {
      await mockStorage.set("ctry_key", "AR");
      const manager = bannersManager(countryApiHost, mockStorage);

      const code = await manager.getCountryCode();
      expect(code).toBe("AR");
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it("fetches country from API if not cached", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: { country: "BR" } });
      const manager = bannersManager(countryApiHost, mockStorage);

      const code = await manager.getCountryCode();
      expect(mockedAxios.get).toHaveBeenCalledWith(countryApiHost, {
        timeout: 3000,
      });
      expect(code).toBe("BR");
      expect(mockStorage.stmap.get("ctry_key")).toBe("BR");
    });

    it("returns null if API returns no country", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: {} });
      const manager = bannersManager(countryApiHost, mockStorage);

      const code = await manager.getCountryCode();
      expect(code).toBeNull();
      expect(mockStorage.stmap.has("ctry_key")).toBe(false);
    });

    it("returns null if API call fails", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));
      const manager = bannersManager(countryApiHost, mockStorage);

      const code = await manager.getCountryCode();
      expect(code).toBeNull();
    });
  });

  describe("getCountryBanners", () => {
    it("returns no banners for a known country now that banner data is emptied", () => {
      const manager = bannersManager(countryApiHost, mockStorage);
      const wide = manager.getCountryBanners(BannerCountry.AR, BannerSize.Wide);
      const narrow = manager.getCountryBanners(
        BannerCountry.AR,
        BannerSize.Narrow,
      );

      expect(wide).toEqual([]);
      expect(narrow).toEqual([]);
    });

    it("returns empty array for unknown country", () => {
      const manager = bannersManager(countryApiHost, mockStorage);
      const result = manager.getCountryBanners(
        "XX" as BannerCountry,
        BannerSize.Wide,
      );
      expect(result).toEqual([]);
    });
  });

  describe("getCountryExtraBanners", () => {
    it("returns no extra banners for a known country now that banner data is emptied", () => {
      const manager = bannersManager(countryApiHost, mockStorage);
      const wide = manager.getCountryExtraBanners(BannerCountry.AR, BannerSize.Wide);
      const narrow = manager.getCountryExtraBanners(BannerCountry.AR, BannerSize.Narrow);

      expect(wide).toEqual([]);
      expect(narrow).toEqual([]);
    });

    it("returns empty array for unknown country", () => {
      const manager = bannersManager(countryApiHost, mockStorage);
      const result = manager.getCountryExtraBanners(
        "XX" as BannerCountry,
        BannerSize.Wide,
      );
      expect(result).toEqual([]);
    });
  });

  describe("getGlobalBanners", () => {
    it("returns no global banners now that banner data is emptied", () => {
      const manager = bannersManager(countryApiHost, mockStorage);
      const wide = manager.getGlobalBanners(BannerSize.Wide);
      const narrow = manager.getGlobalBanners(BannerSize.Narrow);

      expect(wide).toEqual([]);
      expect(narrow).toEqual([]);
    });
  });
});

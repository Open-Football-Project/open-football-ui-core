import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCountryBanners } from "./country-banners";
import { BannersService } from "../../service/banners-service";
import { BannerCountry, BannerSize, BannerType, AnyBanner } from "../../../types/banners";
import { FutballeroUIStorage } from "../../../storage";

const arWideBanner: AnyBanner = {
  id: "betsson-ar-1",
  type: BannerType.Script,
  scriptSrc: "https://example.com/script.js",
  size: BannerSize.Wide,
};

const arNarrowBanner: AnyBanner = {
  id: "betsson-ar-3",
  type: BannerType.Script,
  scriptSrc: "https://example.com/script-narrow.js",
  size: BannerSize.Narrow,
};

describe("useCountryBanners", () => {
  let mockStorage: FutballeroUIStorage;
  let bannerService: BannersService;
  const countryApiHost = "https://api.country.is";

  beforeEach(() => {
    mockStorage = {
      get: vi.fn(async () => null),
      set: vi.fn(async () => {}),
      remove: vi.fn(async () => {}),
    };

    bannerService = {
      bannersManager: vi.fn(() => ({
        getCountryCode: vi.fn(async () => BannerCountry.AR),
        getCountryBanners: vi.fn(() => [arWideBanner]),
        getGlobalBanners: vi.fn(() => []),
      })),
    };
  });

  it("returns banners for the detected country", async () => {
    const { result } = renderHook(() =>
      useCountryBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([arWideBanner]);
    });
  });

  it("returns empty array when country code is null", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => null),
      getCountryBanners: vi.fn(() => [arWideBanner]),
      getGlobalBanners: vi.fn(() => []),
    }));

    const { result } = renderHook(() =>
      useCountryBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("returns empty array when no banners for country", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => BannerCountry.AR),
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
    }));

    const { result } = renderHook(() =>
      useCountryBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("re-fetches banners when size changes", async () => {
    const getCountryBanners = vi.fn((_country: BannerCountry, size: BannerSize) =>
      size === BannerSize.Wide ? [arWideBanner] : [arNarrowBanner]
    );

    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => BannerCountry.AR),
      getCountryBanners,
      getGlobalBanners: vi.fn(() => []),
    }));

    const { result, rerender } = renderHook(
      ({ size }) =>
        useCountryBanners(size, countryApiHost, mockStorage, bannerService),
      { initialProps: { size: BannerSize.Wide } }
    );

    await waitFor(() => {
      expect(result.current).toEqual([arWideBanner]);
    });

    rerender({ size: BannerSize.Narrow });

    await waitFor(() => {
      expect(result.current).toEqual([arNarrowBanner]);
    });
  });

  it("returns empty array when getCountryCode throws", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => {
        throw new Error("API fail");
      }),
      getCountryBanners: vi.fn(() => [arWideBanner]),
      getGlobalBanners: vi.fn(() => []),
    }));

    const { result } = renderHook(() =>
      useCountryBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("does not call getCountryCode and returns empty array when disabled", async () => {
    const getCountryCode = vi.fn(async () => BannerCountry.AR);
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode,
      getCountryBanners: vi.fn(() => [arWideBanner]),
      getGlobalBanners: vi.fn(() => []),
    }));

    const { result } = renderHook(() =>
      useCountryBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService, false)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
    expect(getCountryCode).not.toHaveBeenCalled();
  });
});

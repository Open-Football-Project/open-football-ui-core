import { renderHook, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { useCountryExtraBanners } from "./country-extra-banners";
import { BannersService } from "../../service/banners-service";
import { BannerCountry, BannerSize, BannerType, AnyBanner } from "../../../types/banners";
import { FutballeroUIStorage } from "../../../storage";

const arWideExtraBanner: AnyBanner = {
  id: "ntnfutbol-ar-wide",
  type: BannerType.Link,
  href: "https://youtube.com/@ntnfutbol",
  imgSrc: "https://example.com/ntnfutbol.jpg",
  size: BannerSize.Wide,
};

const arNarrowExtraBanner: AnyBanner = {
  id: "ntnfutbol-ar-narrow",
  type: BannerType.Link,
  href: "https://youtube.com/@ntnfutbol",
  imgSrc: "https://example.com/ntnfutbol.jpg",
  size: BannerSize.Narrow,
};

describe("useCountryExtraBanners", () => {
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
        getCountryBanners: vi.fn(() => []),
        getGlobalBanners: vi.fn(() => []),
        getCountryExtraBanners: vi.fn(() => [arWideExtraBanner]),
      })),
    };
  });

  it("returns extra banners for the detected country", async () => {
    const { result } = renderHook(() =>
      useCountryExtraBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([arWideExtraBanner]);
    });
  });

  it("returns empty array when country code is null", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => null),
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
      getCountryExtraBanners: vi.fn(() => [arWideExtraBanner]),
    }));

    const { result } = renderHook(() =>
      useCountryExtraBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("returns empty array when no extra banners for country", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => BannerCountry.AR),
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
      getCountryExtraBanners: vi.fn(() => []),
    }));

    const { result } = renderHook(() =>
      useCountryExtraBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("re-fetches extra banners when size changes", async () => {
    const getCountryExtraBanners = vi.fn((_country: BannerCountry, size: BannerSize) =>
      size === BannerSize.Wide ? [arWideExtraBanner] : [arNarrowExtraBanner]
    );

    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => BannerCountry.AR),
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
      getCountryExtraBanners,
    }));

    const { result, rerender } = renderHook(
      ({ size }) =>
        useCountryExtraBanners(size, countryApiHost, mockStorage, bannerService),
      { initialProps: { size: BannerSize.Wide } }
    );

    await waitFor(() => {
      expect(result.current).toEqual([arWideExtraBanner]);
    });

    rerender({ size: BannerSize.Narrow });

    await waitFor(() => {
      expect(result.current).toEqual([arNarrowExtraBanner]);
    });
  });

  it("returns empty array when getCountryCode throws", async () => {
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode: vi.fn(async () => {
        throw new Error("API fail");
      }),
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
      getCountryExtraBanners: vi.fn(() => [arWideExtraBanner]),
    }));

    const { result } = renderHook(() =>
      useCountryExtraBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
  });

  it("does not call getCountryCode and returns empty array when disabled", async () => {
    const getCountryCode = vi.fn(async () => BannerCountry.AR);
    bannerService.bannersManager = vi.fn(() => ({
      getCountryCode,
      getCountryBanners: vi.fn(() => []),
      getGlobalBanners: vi.fn(() => []),
      getCountryExtraBanners: vi.fn(() => [arWideExtraBanner]),
    }));

    const { result } = renderHook(() =>
      useCountryExtraBanners(BannerSize.Wide, countryApiHost, mockStorage, bannerService, false)
    );

    await waitFor(() => {
      expect(result.current).toEqual([]);
    });
    expect(getCountryCode).not.toHaveBeenCalled();
  });
});

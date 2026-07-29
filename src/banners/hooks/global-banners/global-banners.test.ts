import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { useGlobalBanners } from "./global-banners";
import { BannersService } from "../../service/banners-service";
import { BannerSize, BannerType, AnyBanner } from "../../../types/banners";

const wideBanner: AnyBanner = {
  id: "awin-jersey-1",
  type: BannerType.Link,
  href: "https://example.com",
  imgSrc: "https://example.com/img.png",
  size: BannerSize.Wide,
};

const narrowBanner: AnyBanner = {
  id: "awin-jersey-3",
  type: BannerType.Link,
  href: "https://example.com",
  imgSrc: "https://example.com/img-narrow.png",
  size: BannerSize.Narrow,
};

describe("useGlobalBanners", () => {
  const makeService = (): BannersService => ({
    bannersManager: vi.fn(() => ({
      getCountryCode: vi.fn(),
      getCountryBanners: vi.fn(),
      getGlobalBanners: vi.fn((size: BannerSize) =>
        size === BannerSize.Wide ? [wideBanner] : [narrowBanner]
      ),
    })),
  });

  it("returns wide banners when size is Wide", () => {
    const { result } = renderHook(() =>
      useGlobalBanners(BannerSize.Wide, makeService())
    );
    expect(result.current).toEqual([wideBanner]);
  });

  it("returns narrow banners when size is Narrow", () => {
    const { result } = renderHook(() =>
      useGlobalBanners(BannerSize.Narrow, makeService())
    );
    expect(result.current).toEqual([narrowBanner]);
  });

  it("recomputes when size changes", () => {
    const service = makeService();
    const { result, rerender } = renderHook(
      ({ size }) => useGlobalBanners(size, service),
      { initialProps: { size: BannerSize.Wide } }
    );

    expect(result.current).toEqual([wideBanner]);

    rerender({ size: BannerSize.Narrow });
    expect(result.current).toEqual([narrowBanner]);
  });
});

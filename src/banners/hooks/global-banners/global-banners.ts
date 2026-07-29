import { useMemo } from "react";
import { AnyBanner, BannerSize } from "../../../types/banners";
import { BannersService } from "../../service/banners-service";

export const useGlobalBanners = (
  size: BannerSize,
  bannerService: BannersService
): AnyBanner[] => {
  return useMemo(
    () => bannerService.bannersManager("", {} as any).getGlobalBanners(size),
    [size, bannerService]
  );
};

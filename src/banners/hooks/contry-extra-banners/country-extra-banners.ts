import { useState, useEffect } from "react";
import { AnyBanner, BannerCountry, BannerSize } from "../../../types/banners";
import { FutballeroUIStorage } from "../../../storage";
import { BannersService } from "../../service/banners-service";

export const useCountryExtraBanners = (
  size: BannerSize,
  countryApiHost: string,
  storage: FutballeroUIStorage,
  bannerService: BannersService,
  enabled = true,
): AnyBanner[] => {
  const [banners, setBanners] = useState<AnyBanner[]>([]);

  const { getCountryCode, getCountryExtraBanners } =
    bannerService.bannersManager(countryApiHost, storage);

  useEffect(() => {
    if (!enabled) {
      setBanners([]);
      return;
    }

    const loadBanners = async () => {
      try {
        const code = await getCountryCode();
        if (!code) {
          setBanners([]);
          return;
        }
        setBanners(getCountryExtraBanners(code as BannerCountry, size));
      } catch {
        setBanners([]);
      }
    };

    loadBanners();
  }, [bannerService, size, enabled]);

  return banners;
};

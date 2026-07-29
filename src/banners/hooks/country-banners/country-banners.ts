import { useState, useEffect } from "react";
import { AnyBanner, BannerCountry, BannerSize } from "../../../types/banners";
import { FootballProjectUIStorage } from "../../../storage";
import { BannersService } from "../../service/banners-service";

export const useCountryBanners = (
  size: BannerSize,
  countryApiHost: string,
  storage: FootballProjectUIStorage,
  bannerService: BannersService,
  enabled = true,
): AnyBanner[] => {
  const [banners, setBanners] = useState<AnyBanner[]>([]);

  const { getCountryCode, getCountryBanners } = bannerService.bannersManager(
    countryApiHost,
    storage,
  );

  useEffect(() => {
    if (!enabled) {
      setBanners([]);
      return;
    }

    const setCountryBanners = async () => {
      try {
        const code = await getCountryCode();
        if (!code) {
          setBanners([]);
          return;
        }
        setBanners(getCountryBanners(code as BannerCountry, size));
      } catch {
        setBanners([]);
      }
    };

    setCountryBanners();
  }, [bannerService, size, enabled]);

  return banners;
};

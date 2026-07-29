import { FootballProjectUIStorage } from "../../storage";
import { AnyBanner, BannerCountry, BannerSize } from "../../types/banners";
import { bannersManager } from "../manager/bannersManager";

export interface BannersService {
  bannersManager: (
    countryApiHost: string,
    storage: FootballProjectUIStorage
  ) => {
    getCountryCode: () => Promise<string | null>;
    getCountryBanners: (country: BannerCountry, size: BannerSize) => AnyBanner[];
    getGlobalBanners: (size: BannerSize) => AnyBanner[];
    getCountryExtraBanners: (country: BannerCountry, size: BannerSize) => AnyBanner[];
  };
}

export const bannersServiceWrapper: BannersService = {
  bannersManager: bannersManager,
};

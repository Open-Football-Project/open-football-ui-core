import axios from "axios";
import { FutballeroUIStorage } from "../../storage";
import { AnyBanner, BannerCountry, BannerSize } from "../../types/banners";
import { countryBannerProviders } from "../provider/country-banner-provider";
import { globalBannerProviders } from "../provider/global-banner-provider";
import { countryExtraBannerProviders } from "../provider/country-extra-banner-provider";

const cacheKey = "ctry_key";

interface CountryApiResponse {
  country?: string;
}

export const bannersManager = (
  countryApiHost: string,
  storage: FutballeroUIStorage
) => {
  const getCountryCode = async (): Promise<string | null> => {
    const cached = await storage.get(cacheKey);
    if (cached) return cached;

    try {
      const { data } = await axios.get<CountryApiResponse>(countryApiHost, {
        timeout: 3000,
      });

      if (data?.country) {
        await storage.set(cacheKey, data.country);
        return data.country;
      }
      return null;
    } catch {
      return null;
    }
  };

  const getCountryBanners = (
    country: BannerCountry,
    size: BannerSize
  ): AnyBanner[] => {
    return (countryBannerProviders.get(country) ?? []).filter(
      (b) => b.size === size
    );
  };

  const getCountryExtraBanners = (
    country: BannerCountry,
    size: BannerSize
  ): AnyBanner[] => {
    return (countryExtraBannerProviders.get(country) ?? []).filter(
      (b) => b.size === size
    );
  };

  const getGlobalBanners = (size: BannerSize): AnyBanner[] => {
    return globalBannerProviders.filter((b) => b.size === size);
  };

  return {
    getCountryCode,
    getCountryBanners,
    getGlobalBanners,
    getCountryExtraBanners
  };
};

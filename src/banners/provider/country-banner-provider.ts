import { AnyBanner, BannerCountry } from "../../types/banners";
import { arBanners } from "./country/ar/ar-banners";
import { gbBanners } from "./country/gb/gb-banners";

export const countryBannerProviders = new Map<BannerCountry, AnyBanner[]>([
  [BannerCountry.AR, arBanners],
  [BannerCountry.GB, gbBanners]
]);

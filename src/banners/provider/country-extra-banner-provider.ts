import { AnyBanner, BannerCountry } from "../../types/banners";
import { arExtraBanners } from "./country/ar/ar-extra-banners";


export const countryExtraBannerProviders = new Map<BannerCountry, AnyBanner[]>([
  [BannerCountry.AR, arExtraBanners]
]);

export enum BannerCountry {
  AR = 'AR',
  GB = 'GB',
}

export enum BannerSize {
  Wide   = 'wide',
  Narrow = 'narrow',
}

export enum BannerType {
  Script    = 'script',
  Link      = 'link',
  Html      = 'html',
  Composite = 'composite',
}

export interface Banner {
  id: string;
  size: BannerSize;
  type: BannerType;
  showGambleAware?: boolean;
}

export interface ScriptBanner extends Banner {
  type: BannerType.Script;
  scriptSrc: string;
}

export interface LinkBanner extends Banner {
  type: BannerType.Link;
  href: string;
  imgSrc?: string;
  label?: string;
}

export interface HtmlBanner extends Banner {
  type: BannerType.Html;
  html: string;
}

export interface CompositeBanner extends Banner {
  type: BannerType.Composite;
  banners: Exclude<AnyBanner, CompositeBanner>[];
}

export type AnyBanner = ScriptBanner | LinkBanner | HtmlBanner | CompositeBanner;

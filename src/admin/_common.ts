import decodeBase64UrlSafe from "@xtjs/lib/js/decodeBase64UrlSafe";
import decodeUtf8 from "@xtjs/lib/js/decodeUtf8";
import encodeBase64UrlSafe from "@xtjs/lib/js/encodeBase64UrlSafe";
import encodeUtf8 from "@xtjs/lib/js/encodeUtf8";

export type Ctx = {
  hostsDir: string;
  hostsDisabledDir: string;
  reload: () => void;
};

export class Prg {
  constructor(readonly page: string) {}
}

export const toHostsFileName = (url: string) =>
  encodeBase64UrlSafe(encodeUtf8(url));
export const toUrl = (hostsFileName: string) =>
  decodeUtf8(decodeBase64UrlSafe(hostsFileName));

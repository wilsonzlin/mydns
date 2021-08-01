import decodeBase64UrlSafe from "@xtjs/lib/js/decodeBase64UrlSafe";
import decodeUtf8 from "@xtjs/lib/js/decodeUtf8";
import encodeBase64UrlSafe from "@xtjs/lib/js/encodeBase64UrlSafe";
import encodeUtf8 from "@xtjs/lib/js/encodeUtf8";
import { readFile } from "fs/promises";

export type Ctx = {
  hostsDir: string;
  hostsDisabledDir: string;
  customDir: string;
  customDisabledDir: string;
  reload: () => void;
};

export class Prg {
  constructor(readonly path: string) {}
}

export const toHostsFileName = (url: string) =>
  encodeBase64UrlSafe(encodeUtf8(url));
export const fromHostsFileName = (hostsFileName: string) =>
  decodeUtf8(decodeBase64UrlSafe(hostsFileName));

export const IPV4_REGEX = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;

export const maybeReadFile = async (file: string) => {
  try {
    return await readFile(file, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") {
      return undefined;
    }
    throw e;
  }
};

#!/usr/bin/env node

import decodeUtf8 from "@xtjs/lib/js/decodeUtf8";
import parseQueryString from "@xtjs/lib/js/parseQueryString";
import readBufferStream from "@xtjs/lib/js/readBufferStream";
import splitString from "@xtjs/lib/js/splitString";
import { spawn } from "child_process";
import { mkdir, realpath, writeFile } from "fs/promises";
import { createServer } from "http";
import { AddressInfo } from "net";
import { join } from "path";
import { renderToStaticMarkup } from "react-dom/server";
import { Command } from "sacli";
import { Ctx, Prg } from "./admin/_common";
import { Page } from "./admin/_Page";
import { PAGES } from "./admin/_pages";

export const startMydns = async ({
  adminPort,
  dnsPort,
  stateDir: rawStateDir,
}: {
  adminPort: number;
  dnsPort: number;
  stateDir: string;
}) => {
  const stateDir = await realpath(rawStateDir);
  const hostsDir = join(stateDir, "hosts");
  await mkdir(hostsDir, { recursive: true });
  const hostsDisabledDir = join(stateDir, "hosts-disabled");
  await mkdir(hostsDisabledDir, { recursive: true });

  const dnsmasq = spawn(
    "dnsmasq",
    [
      "--bogus-priv",
      "--conf-file=/dev/null",
      `--hostsdir=${hostsDir}`,
      // Don't use /etc/hosts.
      "--no-hosts",
      // Don't use system DNS resolvers.
      "--no-resolv",
      "--keep-in-foreground",
      "--log-facility=-",
      "--pid-file=/dev/null",
      `--port=${dnsPort}`,
      "--server=127.0.0.53#5353",
    ],
    { stdio: ["ignore", "inherit", "inherit"] }
  );

  const stubbyYmlPath = join(stateDir, "stubby.yml");
  // language=yaml
  await writeFile(
    stubbyYmlPath,
    `
resolution_type: GETDNS_RESOLUTION_STUB
dns_transport_list:
  - GETDNS_TRANSPORT_TLS
tls_authentication: GETDNS_AUTHENTICATION_REQUIRED
tls_query_padding_blocksize: 256
edns_client_subnet_private: 1
idle_timeout: 10000
listen_addresses:
  - 127.0.0.53@5353
round_robin_upstreams: 1
upstream_recursive_servers:
  - address_data: 8.8.8.8
    tls_auth_name: "dns.google"
  - address_data: 8.8.4.4
    tls_auth_name: "dns.google"
  - address_data: 1.1.1.1
    tls_auth_name: "cloudflare-dns.com"
  - address_data: 1.0.0.1
    tls_auth_name: "cloudflare-dns.com"
    `.trim()
  );
  const stubby = spawn("stubby", ["-C", stubbyYmlPath, "-v", "4"], {
    stdio: ["ignore", "inherit", "inherit"],
  });

  const admin = createServer(async (req, res) => {
    const [pathname = "", query = ""] = splitString(req.url ?? "", "?", 2);
    const pageName = pathname.slice(1) || "Home";
    const pageComponent = (PAGES as any)[pageName]?.[req.method ?? ""];
    if (!pageComponent) {
      return res.writeHead(404).end("Not found");
    }
    const props = parseQueryString(
      req.method == "GET" ? query : decodeUtf8(await readBufferStream(req))
    );
    const ctx: Ctx = {
      hostsDir,
      hostsDisabledDir,
      reload: () => {
        dnsmasq.kill("SIGHUP");
      },
    };
    const result = await pageComponent(ctx, props);
    if (result instanceof Prg) {
      return res
        .writeHead(303, {
          Location: `/${result.page}`,
        })
        .end();
    }
    const html = `<!DOCTYPE html>${renderToStaticMarkup(
      Page({ title: pageName, content: result })
    )}`;
    return res
      .writeHead(200, {
        "Content-Type": "text/html",
      })
      .end(html);
  });
  admin.listen(adminPort, () =>
    console.log(
      `Admin server listening on port ${(admin.address() as AddressInfo).port}`
    )
  );

  return {
    end: () => {
      dnsmasq.kill("SIGKILL");
      stubby.kill("SIGKILL");
      admin.close();
    },
  };
};

if (require.main == module) {
  const cli = Command.new()
    .required("admin", parseInt)
    .required("dns", parseInt)
    .required("state", String)
    .action(({ admin, dns, state }) => {
      startMydns({ adminPort: admin, dnsPort: dns, stateDir: state })
        .then((mydns) => {
          process.on("SIGTERM", mydns.end);
          process.on("SIGINT", mydns.end);
        })
        .catch(console.error);
    });
  cli.eval(process.argv.slice(2));
}

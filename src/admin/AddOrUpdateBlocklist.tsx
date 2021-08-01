import { rm, writeFile } from "fs/promises";
import got from "got";
import { EOL } from "os";
import { join } from "path";
import React from "react";
import { Ctx, IPV4_REGEX, toHostsFileName } from "./_common";

export const GET = async (_ctx: Ctx, {}: {}) => {
  return (
    <div>
      <form method="post" action="/AddOrUpdateBlocklist">
        <label>
          <span>URL</span>
          <input name="url" />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export const POST = async (ctx: Ctx, { url }: { url: string }) => {
  let res;
  try {
    res = await got(url);
  } catch (e) {
    return (
      <div>
        <div>Failed to fetch URL: {e.message}</div>
      </div>
    );
  }

  const parsed = [];
  const unrecognised = [];
  for (let line of res.body.split(/[\r\n]+/)) {
    line = line.replace(/#.*$/, "").trim();
    if (!line) {
      continue;
    }
    let domain = line;
    if (domain.startsWith("0.0.0.0 ")) {
      domain = domain.slice(8).trim();
    }
    if (!/^[a-zA-Z0-9-._]+$/.test(domain) || IPV4_REGEX.test(domain)) {
      // Unrecognised line!
      unrecognised.push(line);
      continue;
    }
    parsed.push(`0.0.0.0 ${domain}`);
  }

  await rm(join(ctx.hostsDisabledDir, toHostsFileName(url)), { force: true });
  await writeFile(join(ctx.hostsDir, toHostsFileName(url)), parsed.join(EOL));

  return (
    <div>
      <h1>
        Added {parsed.length} entries from {url}
      </h1>
      <label>
        <span>Unrecognised lines</span>
        <textarea
          autoComplete="off"
          rows={20}
          defaultValue={unrecognised.join("\n")}
          readOnly
        />
      </label>

      <h2>Add another list</h2>
      <form method="post" action="/AddOrUpdateBlocklist">
        <label>
          <span>URL</span>
          <input name="url" />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

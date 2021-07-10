import { writeFile } from "fs/promises";
import got from "got";
import { EOL } from "os";
import { join } from "path";
import React from "react";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const GET = async (_ctx: Ctx, {}: {}) => {
  return (
    <div>
      <form method="post" action="/AddList">
        <input name="url" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export const POST = async (ctx: Ctx, { url }: { url: string }) => {
  const res = await got(url);
  if (res.statusCode < 200 || res.statusCode > 299) {
    return (
      <div>
        <div>Failed to fetch URL with status {res.statusCode}</div>
      </div>
    );
  }

  await writeFile(
    join(ctx.hostsDir, toHostsFileName(url)),
    res.body
      .split(/[\r\n]+/)
      .filter((l) => l && !l.startsWith("#"))
      .map((domain) => `0.0.0.0 ${domain}`)
      .join(EOL)
  );
  return new Prg("");
};

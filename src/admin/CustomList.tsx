import findAndRemove from "@xtjs/lib/js/findAndRemove";
import mapDefined from "@xtjs/lib/js/mapDefined";
import splitString from "@xtjs/lib/js/splitString";
import { writeFile } from "fs/promises";
import { EOL } from "os";
import { join } from "path";
import React from "react";
import { Ctx, maybeReadFile, Prg, toHostsFileName } from "./_common";

const getCustomList = async (ctx: Ctx, name: string) => {
  const enabledPath = join(ctx.customDir, toHostsFileName(name));
  const disabledPath = join(ctx.customDisabledDir, toHostsFileName(name));
  const [enabled, disabled] = await Promise.all([
    maybeReadFile(enabledPath),
    maybeReadFile(disabledPath),
  ]);
  return {
    path: enabled != undefined ? enabledPath : disabledPath,
    enabled: enabled != undefined,
    contents: (enabled ?? disabled)
      ?.trim()
      .split(/[\r\n]+/)
      .map((l) => splitString(l, /\s+/, 2)),
  };
};

export const GET = async (
  ctx: Ctx,
  {
    name,
  }: {
    name: string;
  }
) => {
  const list = await getCustomList(ctx, name);
  return (
    <div>
      <h1>{name}</h1>
      <div>{list.enabled ? "Enabled" : "Disabled"} custom list</div>
      {mapDefined(list.contents, (contents) => (
        <div>
          <table>
            <thead>
              <tr>
                <th>IP address</th>
                <th>Hostname</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {contents.map(([addr, host], i) => (
                <tr key={i}>
                  <td>{addr}</td>
                  <td>{host}</td>
                  <td>
                    <form method="post">
                      <input type="hidden" name="name" value={name} />
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="ip" value={addr} />
                      <input type="hidden" name="host" value={host} />
                      <button type="submit">Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h1>Add entry</h1>
          <form method="post">
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="action" value="append" />
            <label>
              <span>IP address</span>
              <input name="ip" />
            </label>
            <label>
              <span>Hostname</span>
              <input name="host" />
            </label>
            <button type="submit">Add</button>
          </form>
        </div>
      )) ?? "Not found"}
    </div>
  );
};

export const POST = async (
  ctx: Ctx,
  {
    name,
    action,
    ip,
    host,
  }: {
    name: string;
    action: "append" | "delete";
    ip: string;
    host: string;
  }
) => {
  const list = await getCustomList(ctx, name);
  const newLines = list.contents ?? [];
  switch (action) {
    case "append":
      newLines.push([ip, host]);
      break;
    case "delete":
      findAndRemove(newLines, (l) => l[0] === ip && l[1] === host);
      break;
  }
  await writeFile(list.path, newLines.map((l) => l.join(" ")).join(EOL) + EOL);
  return new Prg(`/CustomList?name=${encodeURIComponent(name)}`);
};

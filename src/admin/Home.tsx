import maybeFileStats from "@xtjs/lib/js/maybeFileStats";
import propertyComparator from "@xtjs/lib/js/propertyComparator";
import { readdir } from "fs/promises";
import { join } from "path";
import React from "react";
import { Ctx, toUrl } from "./_common";

export const GET = async (ctx: Ctx, {}: {}) => {
  const lists = await Promise.all([
    readdir(ctx.hostsDir).then((ents) =>
      Promise.all(
        ents.map(async (e) => ({
          url: toUrl(e),
          updated: await maybeFileStats(join(ctx.hostsDir, e)).then(
            (r) => r?.mtime
          ),
          enabled: true,
        }))
      )
    ),
    readdir(ctx.hostsDisabledDir).then((ents) =>
      Promise.all(
        ents.map(async (e) => ({
          url: toUrl(e),
          updated: await maybeFileStats(join(ctx.hostsDisabledDir, e)).then(
            (r) => r?.mtime
          ),
          enabled: false,
        }))
      )
    ),
  ]).then((r) => Promise.all(r.flat().sort(propertyComparator("url"))));

  return (
    <div>
      <h1>Lists</h1>
      <table>
        <thead>
          <tr>
            <th />
            <th>URL</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lists.map((l) => (
            <tr key={l.url}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked={l.enabled}
                  autoComplete="off"
                  readOnly
                />
              </td>
              <td>{l.url}</td>
              <td>{l.updated?.toLocaleString()}</td>
              <td>
                {l.enabled && (
                  <form action="/AddList" method="post">
                    <input type="hidden" name="url" value={l.url} />
                    <button type="submit">Update</button>
                  </form>
                )}
                <form action="/ToggleList" method="post">
                  <input type="hidden" name="url" value={l.url} />
                  {l.enabled ? (
                    <button type="submit" name="state" value="disabled">
                      Disable
                    </button>
                  ) : (
                    <button type="submit" name="state" value="enabled">
                      Enable
                    </button>
                  )}
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

import maybeFileStats from "@xtjs/lib/js/maybeFileStats";
import propertyComparator from "@xtjs/lib/js/propertyComparator";
import { readdir } from "fs/promises";
import { join } from "path";
import React from "react";
import { Ctx, fromHostsFileName } from "./_common";

export const GET = async (ctx: Ctx, {}: {}) => {
  const lists = await Promise.all([
    readdir(ctx.hostsDir).then((ents) =>
      Promise.all(
        ents.map(async (e) => ({
          url: fromHostsFileName(e),
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
          url: fromHostsFileName(e),
          updated: await maybeFileStats(join(ctx.hostsDisabledDir, e)).then(
            (r) => r?.mtime
          ),
          enabled: false,
        }))
      )
    ),
  ]).then((r) => Promise.all(r.flat().sort(propertyComparator("url"))));
  const customs = await Promise.all([
    readdir(ctx.customDir).then((ents) =>
      Promise.all(
        ents.map(async (e) => ({
          name: fromHostsFileName(e),
          updated: await maybeFileStats(join(ctx.customDir, e)).then(
            (r) => r?.mtime
          ),
          enabled: true,
        }))
      )
    ),
    readdir(ctx.customDisabledDir).then((ents) =>
      Promise.all(
        ents.map(async (e) => ({
          name: fromHostsFileName(e),
          updated: await maybeFileStats(join(ctx.customDisabledDir, e)).then(
            (r) => r?.mtime
          ),
          enabled: false,
        }))
      )
    ),
  ]).then((r) => Promise.all(r.flat().sort(propertyComparator("name"))));

  return (
    <div>
      <h1>Blocklists</h1>
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
                  <form action="/AddOrUpdateBlocklist" method="post">
                    <input type="hidden" name="url" value={l.url} />
                    <button type="submit">Update</button>
                  </form>
                )}
                <form action="/ToggleBlacklist" method="post">
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
                <form action="/DeleteBlacklist" method="post">
                  <input type="hidden" name="url" value={l.url} />
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Custom mappings</h1>
      <table>
        <thead>
          <tr>
            <th />
            <th>List</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customs.map((c) => (
            <tr key={c.name}>
              <td>
                <input
                  type="checkbox"
                  defaultChecked={c.enabled}
                  autoComplete="off"
                  readOnly
                />
              </td>
              <td>{c.name}</td>
              <td>{c.updated?.toLocaleString()}</td>
              <td>
                <a href={`/CustomList?name=${encodeURIComponent(c.name)}`}>
                  View
                </a>

                <form action="/ToggleCustomList" method="post">
                  <input type="hidden" name="name" value={c.name} />
                  {c.enabled ? (
                    <button type="submit" name="state" value="disabled">
                      Disable
                    </button>
                  ) : (
                    <button type="submit" name="state" value="enabled">
                      Enable
                    </button>
                  )}
                </form>
                <form action="/DeleteCustomList" method="post">
                  <input type="hidden" name="name" value={c.name} />
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        (() => {
          for (const $cb of document.querySelectorAll("input[type=checkbox]")) {
            $cb.addEventListener("click", e => e.preventDefault());
          }
        })();
      `,
        }}
      />
    </div>
  );
};

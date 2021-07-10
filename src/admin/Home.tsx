import { readdir } from "fs/promises";
import React from "react";
import { Ctx, toUrl } from "./_common";

export const GET = async (ctx: Ctx, {}: {}) => {
  const lists = await Promise.all([
    readdir(ctx.hostsDir).then((ents) =>
      ents.map((e) => ({
        url: toUrl(e),
        enabled: true,
      }))
    ),
    readdir(ctx.hostsDisabledDir).then((ents) =>
      ents.map((e) => ({
        url: toUrl(e),
        enabled: false,
      }))
    ),
  ]).then((r) => r.flat());

  return (
    <div>
      <h1>Lists</h1>
      <table>
        <thead>
          <tr>
            <th />
            <th>URL</th>
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
              <td>
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

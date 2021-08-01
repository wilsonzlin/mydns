import { writeFile } from "fs/promises";
import { join } from "path";
import React from "react";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const GET = async (_ctx: Ctx, {}: {}) => {
  return (
    <div>
      <h1>Create a new custom list</h1>
      <form method="post" action="/CreateNewCustomList">
        <label>
          <span>Name</span>
          <input name="name" />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export const POST = async (
  ctx: Ctx,
  {
    name,
  }: {
    name: string;
  }
) => {
  await writeFile(join(ctx.customDir, toHostsFileName(name)), "");
  return new Prg(`/CustomList?name=${encodeURIComponent(name)}`);
};

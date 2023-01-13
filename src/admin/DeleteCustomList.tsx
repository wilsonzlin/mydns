import { rm } from "fs/promises";
import { join } from "path";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const POST = async (ctx: Ctx, { name }: { name: string }) => {
  const fileName = toHostsFileName(name);
  const enabledPath = join(ctx.customDir, fileName);
  const disabledPath = join(ctx.customDisabledDir, fileName);
  await rm(disabledPath, { force: true });
  await rm(enabledPath, { force: true });
  ctx.reload();
  return new Prg("/");
};

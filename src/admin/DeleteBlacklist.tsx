import { rm } from "fs/promises";
import { join } from "path";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const POST = async (ctx: Ctx, { url }: { url: string }) => {
  const fileName = toHostsFileName(url);
  const enabledPath = join(ctx.hostsDir, fileName);
  const disabledPath = join(ctx.hostsDisabledDir, fileName);
  await rm(disabledPath, { force: true });
  await rm(enabledPath, { force: true });
  ctx.reload();
  return new Prg("/");
};

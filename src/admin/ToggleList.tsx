import { rename } from "fs/promises";
import { join } from "path";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const POST = async (
  ctx: Ctx,
  { url, state }: { url: string; state: "enabled" | "disabled" }
) => {
  const fileName = toHostsFileName(url);
  const enabledPath = join(ctx.hostsDir, fileName);
  const disabledPath = join(ctx.hostsDisabledDir, fileName);
  if (state == "enabled") {
    await rename(disabledPath, enabledPath);
  } else {
    await rename(enabledPath, disabledPath);
  }
  ctx.reload();
  return new Prg("");
};

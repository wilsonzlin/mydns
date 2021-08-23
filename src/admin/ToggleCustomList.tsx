import { rename } from "fs/promises";
import { join } from "path";
import { Ctx, Prg, toHostsFileName } from "./_common";

export const POST = async (
  ctx: Ctx,
  { name, state }: { name: string; state: "enabled" | "disabled" }
) => {
  const fileName = toHostsFileName(name);
  const enabledPath = join(ctx.customDir, fileName);
  const disabledPath = join(ctx.customDisabledDir, fileName);
  if (state == "enabled") {
    await rename(disabledPath, enabledPath);
  } else {
    await rename(enabledPath, disabledPath);
  }
  ctx.reload();
  return new Prg("/");
};

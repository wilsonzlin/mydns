import { Ctx, Prg } from "./_common";

// This is mostly useful for scripting/API access.
export const POST = async (ctx: Ctx) => {
  ctx.reload();
  return new Prg(`/`);
};

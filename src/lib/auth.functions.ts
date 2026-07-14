import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const passwordSchema = z.string().min(10).max(128);

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().trim().email().max(254),
      password: z.string().min(1).max(128),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const auth = await import("./auth.server");
      return { user: await auth.login(data.email, data.password) };
    } catch (error) {
      const { safeErrorForLog } = await import("./security.server");
      const err = safeErrorForLog(error);
      console.error("[Security] Login processing failed", err);
      throw new Error(`Unable to process sign-in: ${err.message}`);
    }
  });

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const auth = await import("./auth.server");
  return auth.getCurrentUser();
});

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const auth = await import("./auth.server");
  await auth.logout();
  return { success: true };
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .validator(
    z.object({
      currentPassword: z.string().min(1).max(128),
      nextPassword: passwordSchema,
    }),
  )
  .handler(async ({ data }) => {
    const auth = await import("./auth.server");
    return { success: await auth.changePassword(data.currentPassword, data.nextPassword) };
  });

export const resetAdminPassword = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().trim().email().max(254),
      resetCode: z.string().min(1).max(128),
      nextPassword: passwordSchema,
    }),
  )
  .handler(async ({ data }) => {
    const auth = await import("./auth.server");
    return {
      success: await auth.resetPasswordWithCode(data.email, data.resetCode, data.nextPassword),
    };
  });

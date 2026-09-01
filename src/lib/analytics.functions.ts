import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Records an anonymous page view. Public on purpose: it only ever writes a
 * path, referrer and random session id — never personal data.
 */
export const recordPageView = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        path: z.string().trim().min(1).max(300),
        referrer: z.string().trim().max(500).optional().default(""),
        sessionId: z.string().trim().max(80).optional().default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("page_views").insert({
      path: data.path,
      referrer: data.referrer || null,
      session_id: data.sessionId || null,
    });
    return { ok: true as const };
  });

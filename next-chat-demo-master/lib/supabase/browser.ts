import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export const supabaseBrowser = () => {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return browserClient;
};

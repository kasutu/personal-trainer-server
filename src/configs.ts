import type { CorsOptions } from "cors";

export const corsOptions = {
  origin: "https://example.com",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
} satisfies CorsOptions;

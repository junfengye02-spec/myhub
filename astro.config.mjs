import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL || "https://yven.0000238.xyz";

export default defineConfig({
  site,
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 900,
    },
  },
  integrations: [sitemap()],
});

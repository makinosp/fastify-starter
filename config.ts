import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'prisma/config';

const baseDirPath = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL ?? 'file:./dev.db';

export default defineConfig({
  schema: path.join(baseDirPath, 'prisma', 'models'),
  datasource: { url },
});

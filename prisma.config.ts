import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'prisma/config';

const baseDirPath = path.dirname(fileURLToPath(import.meta.url));

const url = process.env.DATABASE_URL ?? 'file:./db/dev.sqlite';

export default defineConfig({
  schema: path.join(baseDirPath, 'prisma', 'schema.prisma'),
  datasource: { url },
});

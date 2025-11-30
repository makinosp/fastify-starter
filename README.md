# fastify-starter

fastify-starter

## Development container (DevContainer)

This repository includes a DevContainer configuration under `.devcontainer` to make it easier to develop using a consistent environment.

Features:

- Node.js 20 (via Microsoft devcontainer image)
- SQLite and PostgreSQL client libraries
- PostgreSQL (optional) running in a docker-compose service for local DB testing
- Prisma support and Post-create command to generate Prisma client

How to use:

1. Install the Remote - Containers extension in VS Code.
2. Open this repository in VS Code and choose "Reopen in Container" when prompted, or open the command palette and pick "Remote-Containers: Reopen in Container".
3. After the container builds, the `postCreateCommand` will run: `npm ci && npx prisma generate`.
4. Run the app with your preferred command. If the project has a `dev` script, use:

```bash
npm run dev
```

If you want to use Postgres instead of the default SQLite dev database, edit `.devcontainer/.env` and uncomment the PostgreSQL `DATABASE_URL` and re-open the container (the `db` service in `docker-compose.yml` will be started).

If you use Prisma Migrate with Postgres, run:

```bash
npx prisma migrate dev --name init
```

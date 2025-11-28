# See https://containers.dev/ for more background
# Use a Microsoft devcontainer image for Node.js + TypeScript
FROM mcr.microsoft.com/devcontainers/javascript-node:1-20

# Install OS deps for sqlite & Postgres client and Prisma
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get install -y --no-install-recommends \
  sqlite3 \
  libsqlite3-dev \
  libpq-dev \
  build-essential \
  ca-certificates \
  git \
  curl \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Optional: set the WORKDIR (overridden by devcontainer workspaceMount by default)
WORKDIR /workspace

# Install global tools we might want in the devcontainer
RUN corepack enable && corepack prepare pnpm@latest --activate || true

# Ensure the container uses the vscode user (handle optionally)
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME || true \
  && useradd --gid $USER_GID --uid $USER_UID -m $USERNAME || true

USER $USERNAME

# Default shell
SHELL ["/bin/bash", "-lc"]

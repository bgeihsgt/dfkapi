# Overview

This is a monorepo that contains packages to expose a REST & GraphQL API to the DFK commmunity

# Development

## Prerequisites

Install Postgres locally and create two databases:

`dfkcommunityapi`
`dfkcommunityapi_test`

Install flyctl

`brew install flyctl`

## Build/test/run

All commands are from the root folder.

### Build
`npm i`
`npm run clean`
`npm run compile`

### Test

`npm t`

### Run

`npm run migrate:latest`
`npm run start:worker`
`npm run start:web`

### Deploy

`flyctl deploy --config fly.api.toml`
`flyctl deploy --config fly.worker.toml`
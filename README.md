# Overview

DISCLAIMER: This repository is very much a work in progress, but I have made it public so the DFK community can see it make progress in the open.

This is a monorepo that contains packages to expose a REST & GraphQL API to the DFK commmunity. These are the packages:

- `packages/api`: Exposes the REST and GraphQL endpoints. This just contains stubs right now, but they will expose the Postgres data in JSON-API and GraphQL formats.
- `packages/worker`: Application that indexes DFK blockchains into a Postgres database.
- `packages/data-dfk:` Reads DFK data from the DFK and Harmony  blockchains.
- `packages/data-postgres`: Reads/writes DFK data from/to Postgres. Contains the Postgres schema & migrations.
- `packages/data-core`: Shared package for the data packages to share common models and utilities.

# Development

## Prerequisites

Install Postgres locally and create two databases:

```
dfkcommunityapi
dfkcommunityapi_test
```

Install flyctl (if you are planning to deploy)

```
brew install flyctl
```

## Build/test/run

All commands are from the root folder.

### Build
```
npm i
npm run clean
npm run compile
```

### Test

```
npm t
```

Note that this project primarily contains integration tests due to the integration-heavy nature of this work.

For talking with the DFK and Harmony blockchains, the tests make use of a [talkback server](https://github.com/ijpiantanida/talkback) that records real responses from the endpoints as tapes in the `tapes` folder. When you write new tests in `@dfkapi/data-dfk` that talk to external endpoints, you need to cd into `packages/data-dfk` and run `npm run test:record` to record the new tapes.

### Run

```
npm run migrate:latest
npm run start:worker
npm run start:api
```

### Deploy

```
flyctl deploy --config fly.api.toml`
flyctl deploy --config fly.worker.toml
```
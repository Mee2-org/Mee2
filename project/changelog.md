# @0.2.15
> *☕️ | Minor Update*

- **Developed By:** @0sapphy
- **Release Date:** 27/11/2024

## New

- ESLint.
- Utility helpers.
- Moderation commands.

## Updated

- Command
  - Handle command options (permisisons & others)
  - `CommandContext.interaction` CacheType
    - e.g `CommandContext<"cached">`
- Logging Style (Added: .debug)
- Prettier Code
- /INFO -> /project

## Removed

- None

# @0.2.5 (& @0.2.7)
> *✨ | Update (0.2.5)*

- **Developed By:** @0sapphy
- **Release Date:** 25/11/2024

## New

- Database (using prisma/client)
- Commands [/settings welcome|/ping]
- Example .env 

## Updated

- Command event (finds command files differently.)
- `createCommand()` `run` param, accepts `CommandContext`.
- Added client to `CommandContext`.
- (prisma): Added logging [query|info|warn|error]

## Removed

- Command checking (`registerApplicationCommands()`)
- Import alias

# @0.1.12
> *The Base*

- **Developed By:** @0sapphy
- **Release Date:** 21/11/2024

## New

- Command Handler (partial)
- Event Handler
- internal helpers
  - @0sapphy

## Updated
- None

## Removed
- None
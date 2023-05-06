# [name]

## Installation

```bash
pnpm add [name] -D
```

## Usage

```typescript
import { defineConfig } from 'vite'
import plugin from '[name]'

export default defineConfig({
  plugins: [plugin()]
})
```

### Options

#### `include`

Type: `string` | `Array<string>`<br>
Default: `[]`

Files to include in this plugin (default all).

#### `exclude`

Type: `string` | `Array<string>`<br>
Default: `[]`

Files to exclude in this plugin (default none).

[LICENSE (Apache 2.0)](/LICENSE)

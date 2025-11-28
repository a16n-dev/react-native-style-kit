import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/utility/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  unbundle: true,
  exports: true,
});

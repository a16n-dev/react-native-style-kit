import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  unbundle: true,
  exports: true,
});

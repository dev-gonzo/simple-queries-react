import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import json from "@rollup/plugin-json";
import external from 'rollup-plugin-peer-deps-external';

const pkg = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourceMap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourceMap: true,
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      json(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: 'dist/esm/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];

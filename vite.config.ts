import {setupVitePlugins, getSrcPath, getRootPath} from './build';

// Utilities
import {defineConfig, loadEnv} from 'vite'
import {createViteProxy} from "./build/config";
import { getServiceEnvConfig } from './.env-config';

// https://vitejs.dev/config/
export default defineConfig(configEnv => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as ImportMetaEnv;
  const rootPath = getRootPath();
  const srcPath = getSrcPath();
  const isOpenProxy = viteEnv.VITE_HTTP_PROXY === 'Y';
  const envConfig = getServiceEnvConfig(viteEnv);

  return {
    plugins: setupVitePlugins(viteEnv),
    define: {'process.env': {}},
    resolve: {
      alias: {
        '~': rootPath,
        '@': srcPath,
      },
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ],
    },
    server: {
      port: 3322,
      open: true,
      host: '0.0.0.0',
      proxy: createViteProxy(isOpenProxy, envConfig)

    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false
      }
    },
    assetsInclude:["**/*.bpmn"]
  }
})

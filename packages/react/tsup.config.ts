import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { defineConfig, type Options } from 'tsup';

type EsbuildPlugin = NonNullable<Options['esbuildPlugins']>[number];

/**
 * vanilla-extract 는 `.css.ts` 의 recipe() 를 `export var button = _7a468({ … })`(createRuntimeFn 호출)로 바꾸는데
 * `/* @__PURE__ *\/` 표시가 없어, 사용자가 Button 하나만 import 해도 모든 컴포넌트의 recipe 가 번들에 남는다.
 * 플러그인의 onLoad 결과에서 이런 최상위 호출에 표시를 붙여 tree-shaking 되게 한다 (size-limit "Button 하나" 가 감시).
 */
function withPureRecipes(plugin: EsbuildPlugin): EsbuildPlugin {
  return {
    name: `${plugin.name}:pure-recipes`,
    setup(build) {
      return plugin.setup({
        ...build,
        onLoad(options, callback) {
          build.onLoad(options, async (args) => {
            const result = await callback(args);
            if (result && typeof result.contents === 'string') {
              result.contents = result.contents.replace(/^(export var [\w$]+ = )(_[\w$]+\()/gm, '$1/* @__PURE__ */ $2');
            }
            return result;
          });
        },
      });
    },
  };
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  // Next.js App Router 등 RSC 환경에서 클라이언트 컴포넌트로 인식되도록 한다.
  banner: { js: '"use client";' },
  esbuildPlugins: [withPureRecipes(vanillaExtractPlugin({ identifiers: 'short' }))],
});

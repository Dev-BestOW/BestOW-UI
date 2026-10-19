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

const common = {
  sourcemap: true,
  external: ['react', 'react-dom'],
  esbuildPlugins: [withPureRecipes(vanillaExtractPlugin({ identifiers: 'short' }))],
} satisfies Options;

/**
 * ESM 은 두 파일로 나눈다 — Next.js App Router 의 서버 컴포넌트에서 함수·값(createTheme, vars, formatKoreanAmount …)을
 * 그대로 호출할 수 있게 하려는 것. 번들 전체에 "use client" 를 붙이면 이런 함수도 클라이언트 참조가 되어
 * 서버에서 부르면 "Attempted to call createTheme() from the server" 로 실패한다.
 *   dist/client.js  "use client" — 컴포넌트·hook (src/client.ts)
 *   dist/shared.js  지시어 없음 — 순수 함수·값 (src/shared.ts)
 *   dist/index.js   둘을 export * 로 합침 (onSuccess 에서 작성)
 * 두 entry 가 함께 쓰는 모듈(vars, cx …)은 esbuild 가 chunk 로 뽑는다 — 순수 모듈뿐이라 지시어가 필요 없다.
 * CSS 는 CJS 빌드가 만드는 dist/index.css(모든 CSS) 를 쓰고, ESM 빌드가 entry 별로 만드는 CSS 는 지운다.
 */
const esm: Options = {
  ...common,
  entry: { client: 'src/client.ts', shared: 'src/shared.ts' },
  format: ['esm'],
  splitting: true,
  dts: { entry: { index: 'src/index.ts' } },
  async onSuccess() {
    const { readFile, rm, writeFile } = await import('node:fs/promises');
    // "use client" 는 src/client.ts 맨 위의 지시어를 esbuild 가 entry 출력에 그대로 남긴다 — 빠지면 빌드를 실패시킨다
    if (!(await readFile('dist/client.js', 'utf8')).startsWith('"use client";')) {
      throw new Error('dist/client.js 맨 앞에 "use client" 가 없습니다');
    }
    await writeFile('dist/index.js', "export * from './shared.js';\nexport * from './client.js';\n");
    for (const file of ['client.css', 'client.css.map', 'shared.css', 'shared.css.map']) {
      await rm(`dist/${file}`, { force: true });
    }
  },
};

/**
 * vanilla-extract 는 CSS 파일마다 `vanilla-extract-css-ns:<경로>.vanilla.css?source=<원본 CSS base64>` 라는 이름을 붙이고,
 * esbuild 는 압축하지 않은 CSS 에 파일마다 그 이름을 주석으로 남긴다 — styles.css(brotli 33 kB)의 24 kB 가 이 주석이었다.
 * 주석과 소스맵 sources 를 경로(`src/components/Badge/Badge.css.ts`)만 남기게 줄인다. 주석은 줄을 지우지 않고 내용만 바꿔
 * 소스맵의 줄 번호가 그대로 맞는다. 형식이 바뀌어 하나라도 남으면 빌드를 실패시킨다 (size-limit "styles.css" 도 감시).
 */
async function shortenCssSourceNames() {
  const { readFile, writeFile } = await import('node:fs/promises');
  const shorten = (name: string) => name.replace(/^vanilla-extract-css-ns:(.+?)\.vanilla\.css\?source=.*$/, '$1');
  const css = (await readFile('dist/index.css', 'utf8')).replace(
    /^\/\* (vanilla-extract-css-ns:\S+) \*\/$/gm,
    (_, name: string) => `/* ${shorten(name)} */`,
  );
  const map = JSON.parse(await readFile('dist/index.css.map', 'utf8')) as { sources: string[] };
  map.sources = map.sources.map(shorten);
  if (css.includes('vanilla-extract-css-ns:') || map.sources.some((source) => source.includes('?source='))) {
    throw new Error(
      'dist/index.css 에 vanilla-extract 디버그 이름이 남았습니다 (tsup.config.ts shortenCssSourceNames)',
    );
  }
  await writeFile('dist/index.css', css);
  await writeFile('dist/index.css.map', JSON.stringify(map));
}

/** CJS 는 지금처럼 한 파일 (require 로 서버 컴포넌트를 쓰는 경우는 드물다). dist/index.css 도 여기서 나온다. */
const cjs: Options = {
  ...common,
  entry: { index: 'src/index.ts' },
  format: ['cjs'],
  dts: { entry: { index: 'src/index.ts' } },
  banner: { js: '"use client";' },
  onSuccess: shortenCssSourceNames,
};

// 두 설정이 동시에 돌기 때문에 clean 은 build 스크립트에서 한 번만 한다
export default defineConfig([esm, cjs]);

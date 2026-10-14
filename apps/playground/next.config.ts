import type { NextConfig } from 'next';

// 평소(개발·CI 빌드)에는 아무 설정도 하지 않는다: 사용자가 @bestow-ui/* 를 설치했을 때와 같은 조건으로 확인하기 위해서다.
// GitHub Pages 배포용 빌드에서만 PLAYGROUND_BASE_PATH(예: /BestOW-UI/playground)를 주어 정적 export 한다.
const basePath = process.env.PLAYGROUND_BASE_PATH;

const nextConfig: NextConfig = basePath
  ? {
      output: 'export',
      basePath,
      trailingSlash: true, // 정적 호스팅에서 /interactive/ → interactive/index.html 로 찾도록
    }
  : {};

export default nextConfig;

// scripts/indexnow.mjs 의 타입 — apps/site/app/indexnow.test.ts 가 부른다
export declare const ORIGIN: string;
export declare const KEY: string;
export declare const ENDPOINTS: string[];
export declare function parseSitemap(xml: string): Map<string, string | null>;
export declare function changedUrls(oldXml: string, newXml: string): string[];

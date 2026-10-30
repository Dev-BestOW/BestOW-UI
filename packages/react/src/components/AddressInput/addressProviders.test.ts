import type { AddressProvider } from './addressProviders';

const SCRIPT = 'script[src*="postcode"]';
type Complete = (data: Record<string, string>) => void;
const kakaoWindow = window as unknown as { kakao?: { Postcode?: unknown }; daum?: { Postcode?: unknown } };

/** 모듈 안의 "불러오는 중" 상태를 테스트마다 비우려고 새로 불러온다 */
async function loadProvider(): Promise<AddressProvider> {
  vi.resetModules();
  return (await import('./addressProviders')).kakaoPostcodeProvider;
}

function fakePostcode() {
  const embed = vi.fn();
  let oncomplete: Complete = () => undefined;
  const Postcode = class {
    constructor(options: { oncomplete: Complete }) {
      oncomplete = options.oncomplete;
    }
    embed = embed;
  };
  return { Postcode, embed, complete: (data: Record<string, string>) => oncomplete(data) };
}

const lastScript = () => [...document.querySelectorAll<HTMLScriptElement>(SCRIPT)].at(-1)!;

afterEach(() => {
  delete kakaoWindow.kakao;
  delete kakaoWindow.daum;
  document.querySelectorAll(SCRIPT).forEach((script) => script.remove());
});

describe('kakaoPostcodeProvider', () => {
  it('이미 있는 서비스를 쓰고, 도로명·지번에 맞는 주소를 넘긴다', async () => {
    const { Postcode, embed, complete } = fakePostcode();
    kakaoWindow.daum = { Postcode };
    const container = document.createElement('div');
    const onSelect = vi.fn();
    await (
      await loadProvider()
    )(container, onSelect);
    expect(embed).toHaveBeenCalledWith(container);
    expect(document.querySelector(SCRIPT)).toBeNull();

    const common = { zonecode: '06234', bname: '역삼동', buildingName: '래미안', apartment: 'Y' };
    complete({ ...common, userSelectedType: 'R', roadAddress: '테헤란로 1', jibunAddress: '역삼동 1' });
    expect(onSelect).toHaveBeenLastCalledWith({
      zonecode: '06234',
      address: '테헤란로 1',
      extraAddress: ' (역삼동, 래미안)',
    });

    complete({ ...common, userSelectedType: 'J', roadAddress: '테헤란로 1', jibunAddress: '역삼동 1' });
    expect(onSelect).toHaveBeenLastCalledWith({ zonecode: '06234', address: '역삼동 1', extraAddress: '' });

    complete({ ...common, userSelectedType: 'J', roadAddress: '', jibunAddress: '', autoJibunAddress: '자동 지번' });
    expect(onSelect).toHaveBeenLastCalledWith({ zonecode: '06234', address: '자동 지번', extraAddress: '' });
  });

  it('서비스가 없으면 스크립트를 한 번만 불러온다', async () => {
    const provider = await loadProvider();
    const first = provider(document.createElement('div'), vi.fn());
    const second = provider(document.createElement('div'), vi.fn());
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(1);

    const { Postcode, embed } = fakePostcode();
    kakaoWindow.kakao = { Postcode };
    lastScript().dispatchEvent(new Event('load'));
    await Promise.all([first, second]);
    expect(embed).toHaveBeenCalledTimes(2);
  });

  it('스크립트를 불러오지 못하면 알리고, 다음에 다시 시도한다', async () => {
    const provider = await loadProvider();
    const failed = provider(document.createElement('div'), vi.fn());
    lastScript().dispatchEvent(new Event('error'));
    await expect(failed).rejects.toThrow('불러오지 못했어요');

    const retry = provider(document.createElement('div'), vi.fn());
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(2);
    const { Postcode } = fakePostcode();
    kakaoWindow.kakao = { Postcode };
    lastScript().dispatchEvent(new Event('load'));
    await expect(retry).resolves.toBeUndefined();
  });

  it('스크립트는 받았지만 서비스가 없으면 알리고, 다음에 다시 시도한다', async () => {
    const provider = await loadProvider();
    const failed = provider(document.createElement('div'), vi.fn());
    lastScript().dispatchEvent(new Event('load'));
    await expect(failed).rejects.toThrow('찾지 못했어요');

    const retry = provider(document.createElement('div'), vi.fn());
    expect(document.querySelectorAll(SCRIPT)).toHaveLength(2);
    const { Postcode } = fakePostcode();
    kakaoWindow.kakao = { Postcode };
    lastScript().dispatchEvent(new Event('load'));
    await expect(retry).resolves.toBeUndefined();
  });
});

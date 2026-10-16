import { warnOnce } from './warnOnce';

describe('warnOnce', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('같은 메시지는 한 번만 경고한다', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnOnce('한 번만');
    warnOnce('한 번만');
    warnOnce('다른 메시지');
    expect(warn.mock.calls).toEqual([['[BestOW UI] 한 번만'], ['[BestOW UI] 다른 메시지']]);
  });

  it('production 에서는 경고하지 않는다', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    warnOnce('production 메시지');
    expect(warn).not.toHaveBeenCalled();
  });
});

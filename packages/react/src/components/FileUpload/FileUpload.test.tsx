import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { en } from '../../i18n/en';
import { FileUpload } from './FileUpload';

const file = (name: string, size = 1000, type = 'application/pdf') =>
  new File([new Uint8Array(size)], name, { type, lastModified: 1 });
const nativeInput = (container: HTMLElement) => container.querySelector('input[type="file"]') as HTMLInputElement;
const status = () => screen.getByRole('status');
const listedNames = () =>
  within(screen.getByRole('list', { name: '선택한 파일' }))
    .getAllByRole('listitem')
    .map((item) => item.querySelector('span:nth-child(2)')?.textContent);

describe('FileUpload', () => {
  it('레이블이 그룹 이름이고, "파일 선택" 버튼이 숨긴 input 을 연다', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="증빙 서류" helperText="PDF, 10MB 이하" />);
    const group = screen.getByRole('group', { name: '증빙 서류' });
    expect(group.getAttribute('aria-describedby')).toBe(screen.getByText('PDF, 10MB 이하').id);
    const input = nativeInput(container);
    expect(input.tabIndex).toBe(-1);
    expect(input.getAttribute('aria-hidden')).toBe('true');
    const click = vi.spyOn(input, 'click');
    await user.click(screen.getByRole('button', { name: '파일 선택' }));
    expect(click).toHaveBeenCalled();
  });

  it('고른 파일을 이름·크기와 삭제 버튼으로 보여 주고 onValueChange 로 넘긴다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<FileUpload label="서류" multiple onValueChange={onValueChange} />);
    await user.upload(nativeInput(container), [file('계약서.pdf', 2048), file('신분증.pdf', 3 * 1024 * 1024)]);
    expect(listedNames()).toEqual(['계약서.pdf', '신분증.pdf']);
    expect(screen.getByText('2.0 KB')).toBeTruthy();
    expect(screen.getByText('3.0 MB')).toBeTruthy();
    expect(screen.getByRole('button', { name: '계약서.pdf 삭제' })).toBeTruthy();
    expect(onValueChange.mock.lastCall![0].map((f: File) => f.name)).toEqual(['계약서.pdf', '신분증.pdf']);
    expect(status().textContent).toBe('파일 2개 선택됨');
  });

  it('multiple 이면 이어서 더하고 같은 파일은 한 번만, 아니면 새로 고른 것으로 바꾼다', async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<FileUpload label="서류" multiple />);
    await user.upload(nativeInput(container), file('a.pdf'));
    await user.upload(nativeInput(container), [file('a.pdf'), file('b.pdf')]);
    expect(listedNames()).toEqual(['a.pdf', 'b.pdf']);
    unmount();
    const single = render(<FileUpload label="서류" />);
    await user.upload(nativeInput(single.container), file('a.pdf'));
    await user.upload(nativeInput(single.container), file('b.pdf'));
    expect(listedNames()).toEqual(['b.pdf']);
  });

  it('형식·크기·개수 조건에 안 맞는 파일은 빼고 이유를 보여 주며 알린다', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onReject = vi.fn();
    const { container } = render(
      <FileUpload label="서류" multiple accept=".pdf,image/*" maxSize={1024 * 1024} maxFiles={2} onReject={onReject} />,
    );
    await user.upload(nativeInput(container), [
      file('ok.pdf'),
      file('photo.png', 100, 'image/png'),
      file('memo.txt', 100, 'text/plain'),
      file('big.pdf', 2 * 1024 * 1024),
      file('third.pdf'),
    ]);
    expect(listedNames()).toEqual(['ok.pdf', 'photo.png']);
    expect(onReject.mock.calls[0]![0].map((r: { file: File; reason: string }) => [r.file.name, r.reason])).toEqual([
      ['memo.txt', 'type'],
      ['big.pdf', 'size'],
      ['third.pdf', 'count'],
    ]);
    const group = screen.getByRole('group', { name: '서류' });
    const errors = document.getElementById(group.getAttribute('aria-describedby')!)!;
    expect(errors.textContent).toContain('memo.txt: 올릴 수 없는 형식이에요.');
    expect(errors.textContent).toContain('big.pdf: 1.0 MB 이하만 올릴 수 있어요.');
    expect(errors.textContent).toContain('파일은 2개까지 올릴 수 있어요.');
    expect(status().textContent).toContain('파일 2개 선택됨');
    expect(status().textContent).toContain('memo.txt: 올릴 수 없는 형식이에요.');
  });

  it('삭제하면 다음 삭제 버튼으로, 마지막 파일이면 "파일 선택" 버튼으로 포커스가 간다', async () => {
    const user = userEvent.setup();
    const { container } = render(<FileUpload label="서류" multiple />);
    await user.upload(nativeInput(container), [file('a.pdf'), file('b.pdf')]);
    await user.click(screen.getByRole('button', { name: 'a.pdf 삭제' }));
    expect(listedNames()).toEqual(['b.pdf']);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'b.pdf 삭제' }));
    expect(status().textContent).toBe('a.pdf 삭제됨');
    await user.click(screen.getByRole('button', { name: 'b.pdf 삭제' }));
    expect(screen.queryByRole('list', { name: '선택한 파일' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: '파일 선택' }));
  });

  it('끌어다 놓아도 더해진다', () => {
    render(<FileUpload label="서류" />);
    const group = screen.getByRole('group', { name: '서류' });
    fireEvent.dragEnter(group, { dataTransfer: { files: [] } });
    expect(group.hasAttribute('data-dragging')).toBe(true);
    fireEvent.drop(group, { dataTransfer: { files: [file('dropped.pdf')] } });
    expect(group.hasAttribute('data-dragging')).toBe(false);
    expect(listedNames()).toEqual(['dropped.pdf']);
  });

  it('제어 모드: value 를 그대로 보여 주고, 부모가 바꾸지 않으면 목록도 그대로다', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <FileUpload label="서류" multiple value={[file('kept.pdf')]} onValueChange={onValueChange} />,
    );
    await user.upload(nativeInput(container), file('new.pdf'));
    expect(onValueChange.mock.calls[0]![0].map((f: File) => f.name)).toEqual(['kept.pdf', 'new.pdf']);
    expect(listedNames()).toEqual(['kept.pdf']);
  });

  it('disabled 면 버튼이 비활성이고 놓아도 더해지지 않는다', () => {
    render(<FileUpload label="서류" disabled />);
    expect((screen.getByRole('button', { name: '파일 선택' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.drop(screen.getByRole('group', { name: '서류' }), { dataTransfer: { files: [file('x.pdf')] } });
    expect(screen.queryByRole('list', { name: '선택한 파일' })).toBeNull();
  });

  it('문구는 LocaleProvider 로 바꿀 수 있다', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LocaleProvider messages={en}>
        <FileUpload label="Files" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeTruthy();
    await user.upload(nativeInput(container), file('a.pdf'));
    expect(screen.getByRole('button', { name: 'Remove a.pdf' })).toBeTruthy();
    expect(status().textContent).toBe('1 file selected');
  });
});

import { en } from './en';

const HANGUL = /[가-힣]/;

describe('en', () => {
  it('글자 문구에 한국어가 남아 있지 않다', () => {
    const left = Object.entries(en).filter(([, value]) => typeof value === 'string' && HANGUL.test(value));
    expect(left).toEqual([]);
  });

  it('값이 들어가는 문구는 단수·복수와 값을 맞게 만든다', () => {
    expect(en.paginationPage?.(3)).toBe('Page 3');
    expect(en.filesSelected?.(1)).toBe('1 file selected');
    expect(en.filesSelected?.(2)).toBe('2 files selected');
    expect(en.fileRemove?.('a.txt')).toBe('Remove a.txt');
    expect(en.fileRemoved?.('a.txt')).toBe('a.txt removed');
    expect(en.fileTooLarge?.('a.txt', '5 MB')).toBe('a.txt: files must be 5 MB or smaller.');
    expect(en.fileTypeNotAllowed?.('a.txt')).toBe('a.txt: this file type is not allowed.');
    expect(en.fileTooMany?.(3)).toBe('You can upload up to 3 files.');
    expect(en.errorSummaryTitle?.(1)).toContain('1 problem');
    expect(en.errorSummaryTitle?.(2)).toContain('2 problems');
    expect(en.residentNumberIncomplete?.(13)).toBe('Enter all 13 digits.');
    expect(en.monthTitle?.(2026, 10)).toBe('October 2026');
    expect(en.removeTag?.('apple')).toBe('Remove apple');
    expect(en.removeTag?.('')).toBe('Remove');
    expect(en.tagRemoved?.('apple')).toBe('apple removed');
    expect(en.maxSelected?.(3)).toBe('You can choose up to 3.');
  });
});

import { globalStyle } from '@vanilla-extract/css';
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

// Button 의 색·variant 스타일 위에 정사각형 크기와 아이콘 크기만 더한다
export const iconButton = recipe({
  // '&&' 로 구체성을 올려 CSS 파일 순서와 상관없이 Button size 의 paddingInline 을 덮어쓴다
  base: { flexShrink: 0, selectors: { '&&': { paddingInline: 0 } } },
  variants: {
    size: {
      sm: { width: '32px' },
      md: { width: '40px' },
      lg: { width: '48px' },
    },
  },
  defaultVariants: { size: 'md' },
});

// 아이콘 크기를 버튼 크기에 맞춘다 (아이콘의 width/height 속성보다 CSS 가 우선한다)
const iconSizes = { sm: '16px', md: '20px', lg: '24px' } as const;
for (const [size, value] of Object.entries(iconSizes)) {
  globalStyle(`${iconButton.classNames.variants.size[size as keyof typeof iconSizes]} svg`, {
    width: value,
    height: value,
  });
}

export type IconButtonVariants = NonNullable<RecipeVariants<typeof iconButton>>;

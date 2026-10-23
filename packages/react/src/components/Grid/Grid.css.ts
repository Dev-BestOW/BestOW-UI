import { style } from '@vanilla-extract/css';
import { responsiveProperty } from '../../styles/responsiveProperty';

export { responsiveGap } from '../../styles/responsive.css';

export const grid = style({ display: 'grid', minWidth: 0 });

/** 열 구성 — Grid.tsx 가 columns·minItemWidth 를 구간별 CSS 변수로 넣는다 */
export const columns = responsiveProperty('grid-columns', 'gridTemplateColumns');

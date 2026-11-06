import type { Meta, StoryObj } from '@storybook/react-vite';
import { CorporateNumberInput } from './CorporateNumberInput';

const meta = {
  title: 'Korean Kit/CorporateNumberInput',
  component: CorporateNumberInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <CorporateNumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '법인등록번호 입력이에요. 000000-0000000 형식으로 하이픈을 넣고, 13자리를 채우면 검증 공식으로 오타를 걸러요. 실제로 등기된 법인인지는 등기소 조회가 필요해요. 사업자등록번호는 `BusinessNumberInput` 이에요.',
      },
    },
  },
} satisfies Meta<typeof CorporateNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Valid: Story = { name: '올바른 번호', args: { defaultValue: '1301110006246' } };

export const Invalid: Story = { name: '검증 실패', args: { defaultValue: '1301110006247' } };

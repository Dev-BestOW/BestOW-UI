import type { Meta, StoryObj } from '@storybook/react-vite';
import { BusinessNumberInput } from './BusinessNumberInput';

const meta = {
  title: 'Korean Kit/BusinessNumberInput',
  component: BusinessNumberInput,
  tags: ['autodocs'],
  render: (args) => (
    <div style={{ width: 300 }}>
      <BusinessNumberInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        component:
          '사업자등록번호 입력이에요. 123-45-67890 형식으로 하이픈을 넣고, 10자리를 채우면 검증 공식으로 오타를 걸러요. 검증 공식은 형식 확인용이라 실제 등록·휴폐업 여부는 국세청 조회가 필요해요. `isValidBusinessNumber` 함수도 따로 쓸 수 있어요.',
      },
    },
  },
} satisfies Meta<typeof BusinessNumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Valid: Story = { name: '올바른 번호', args: { defaultValue: '1248100998' } };

export const Invalid: Story = { name: '검증 실패', args: { defaultValue: '1234567890' } };

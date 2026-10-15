import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Stack } from '../Stack';
import { Typography } from '../Typography';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    totalPages: 20,
    defaultPage: 1,
    onPageChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Middle: Story = {
  args: { defaultPage: 10 },
};

export const FewPages: Story = {
  args: { totalPages: 5, defaultPage: 3 },
};

export const Small: Story = {
  args: { size: 'sm', defaultPage: 10 },
};

/** `page` + `onPageChange` 로 목록 데이터와 함께 제어한다. */
export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    return (
      <Stack gap={3}>
        <Typography variant="body-sm" color="muted">
          {page} / {args.totalPages} 페이지
        </Typography>
        <Pagination {...args} page={page} onPageChange={setPage} />
      </Stack>
    );
  },
};

import type { Metadata } from 'next';
import { SignupFlow } from './SignupFlow';

export const metadata: Metadata = { title: '회원가입' };

export default function SignupPage() {
  return <SignupFlow />;
}

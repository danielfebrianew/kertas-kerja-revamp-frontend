import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TematikClient from './_components/TematikClient';

export default async function PemdaTematikPage() {
  const session: any = await getServerSession(authOptions);

  if (!session?.accessToken) {
    redirect('/');
  }

  return <TematikClient />;
}

import Landing from '@/components/Landing';
import { getContent } from '@/lib/store';

// 한 시간마다 새로 만들고, 관리자 페이지에서 저장하면 즉시 다시 만듭니다.
export const revalidate = 3600;

export default async function Home() {
  const content = await getContent();
  return <Landing content={content} />;
}

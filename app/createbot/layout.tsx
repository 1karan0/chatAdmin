import Layout from '@/components/layout/Layout';

export default function CreateBotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
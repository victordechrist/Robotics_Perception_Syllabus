export async function generateStaticParams() {
  return [{ slug: "demo" }];
}

export default async function LabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="container py-8"><h1>Lab: {slug}</h1></div>;
}

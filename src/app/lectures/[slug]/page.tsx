export async function generateStaticParams() {
  return [{ slug: "demo" }];
}

export default async function LectureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="container py-8"><h1>Lecture: {slug}</h1></div>;
}

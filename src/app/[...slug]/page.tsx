import { notFound } from "next/navigation";
import { getFlexiblePage } from "@/lib/cms";
import { PageBlocks } from "@/components/flex/PageBlocks";

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = await getFlexiblePage(slug);
  if (!page) return {};
  return {
    title: page.meta.seo_title || page.title,
    description: page.meta.search_description || undefined,
  };
}

export default async function FlexiblePageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const page = await getFlexiblePage(slug);
  if (!page) notFound();

  return <PageBlocks blocks={page.body} />;
}

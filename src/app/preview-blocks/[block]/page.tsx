import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBlocks } from "@/components/flex/PageBlocks";
import { BLOCK_PLACEHOLDERS, BLOCK_KEYS } from "@/lib/blockPlaceholders";
import type { FlexBlock } from "@/lib/cms";

/**
 * Renders a single page-builder block from its placeholder content, with no
 * page chrome around it. Used to generate the block-picker preview images in
 * the CMS (`scripts/gen-block-previews.mjs`); not linked anywhere and kept out
 * of search results.
 */

export const dynamic = "force-static";

export function generateStaticParams() {
  return BLOCK_KEYS.map((block) => ({ block }));
}

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function BlockPreviewRoute({
  params,
}: {
  params: Promise<{ block: string }>;
}) {
  const { block } = await params;
  if (!BLOCK_KEYS.includes(block as FlexBlock["type"])) notFound();

  const key = block as FlexBlock["type"];
  const one = { type: key, value: BLOCK_PLACEHOLDERS[key] } as FlexBlock;

  return (
    <div id="block-preview">
      <PageBlocks blocks={[one]} />
    </div>
  );
}

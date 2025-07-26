import { CheckoutView } from "@/modules/cart/ui/views/checkout-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}
const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  return <CheckoutView tenantSlug={slug} />;
};
export default Page;

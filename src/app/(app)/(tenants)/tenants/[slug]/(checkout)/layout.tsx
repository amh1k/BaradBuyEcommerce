import { Navbar } from "@/modules/cart/ui/components/navbar";
import { Footer } from "@/modules/home/ui/components/footer";
//import { Navbar } from "@/modules/home/ui/components/navbar";
interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export default async function Layout({ children, params }: Props) {
  const { slug } = await params;
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F0]">
      <Navbar slug={slug} />

      <div className="flex-1 ">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

import { Footer } from "./footer";
import { Category } from "@/payload-types";
import { Navbar } from "./navbar";
import { SearchFilters } from "./search-filters";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { CustomCategory } from "./types";
interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
    sort: "name",
  });

  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      subcategories: undefined,
    })),
  }));
  console.log(formattedData);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}

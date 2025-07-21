interface Props {
  params: Promise<{ category: string; subcategory: string }>;
}

const Page = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  return (
    <div>
      {subcategory}
      <p>{category}</p>
    </div>
  );
};
export default Page;

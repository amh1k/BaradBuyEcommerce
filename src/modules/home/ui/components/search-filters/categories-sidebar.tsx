"use client";
import { CustomCategory } from "../../../../../app/(app)/(home)/types";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../../../../app/(app)/components/ui/sheet";
import { ScrollArea } from "../../../../../app/(app)/components/ui/scroll-area";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
//import { Button } from "../../../../../app/(app)/components/ui/button";
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[];
}

export const CategoriesSideBar = ({ open, onOpenChange, data }: Props) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategories, setSelectedCategories] =
    useState<CustomCategory | null>(null);
  const currentCategories = parentCategories ?? data ?? [];
  console.log(currentCategories);

  const handleOpenChange = (open: boolean) => {
    setSelectedCategories(null);
    setParentCategories(null);
    onOpenChange(open);
  };
  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategories(category);
    } else {
      // this is a subcategory
      if (parentCategories && selectedCategories) {
        router.push(`/${selectedCategories.slug}/${category.slug}`);
      }
      // this is a mian catgeory
      else {
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };
  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
    }
    setSelectedCategories(null);
  };
  const backgroundColor = selectedCategories?.color || "white";
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        <SheetHeader className="p-4 border-b ">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropDownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // width of dropdown w-60 = 240px
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;
    if (left + dropdownWidth > window.innerWidth) {
      //align to right edge of button instead
      left = rect.right + window.scrollX - dropdownWidth;
      //if stil off screen align to tight edge of viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    // ensre drop down doesnt go off left edge
    if (left < 0) {
      left = 16;
    }
    return { top, left };
  };
  return { getDropDownPosition };
};

import { useRef, useCallback, useEffect } from "react";
import { Dropdown, DropdownProps, DropdownType } from "../sharedBase/globalImports";

export const DropdownWithAutoClose = (props: DropdownProps) => {
  const dropdownRef = useRef<DropdownType>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (panelRef.current && panelRef.current.contains(target)) {
      return;
    }
    if (dropdownRef.current) {
      dropdownRef.current.hide();
    }
  }, []);

  const handleShow = () => {
    const panel = document.querySelector(".p-dropdown-panel") as HTMLElement | null;
    panelRef.current = panel;

    window.addEventListener("scroll", handleScroll, true);
  };

  const handleHide = () => {
    window.removeEventListener("scroll", handleScroll, true);
    panelRef.current = null;
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [handleScroll]);

  return (
    <Dropdown
      ref={dropdownRef}
      onShow={handleShow}
      onHide={handleHide}
      {...props}
    />
  );
};

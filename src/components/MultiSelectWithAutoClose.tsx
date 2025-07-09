import { useRef, useCallback, useEffect } from "react";
import { MultiSelect, MultiSelectProps, MultiSelectType } from "../sharedBase/globalImports";


export const MultiSelectWithAutoClose = (props:MultiSelectProps) => {
  const multiSelectRef = useRef<MultiSelectType>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement;
    if (panelRef.current && panelRef.current.contains(target)) {
      return;
    }
    if (multiSelectRef.current) {
      multiSelectRef.current.hide();
    }
  }, []);

  const handleShow = () => {
    const panel = document.querySelector(".p-multiselect-panel") as HTMLElement | null;
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
    <MultiSelect
      ref={multiSelectRef}
      onShow={handleShow}
      onHide={handleHide}
      appendTo={typeof window !== "undefined" ? document.body : undefined}
      {...props}
    />
  );
};

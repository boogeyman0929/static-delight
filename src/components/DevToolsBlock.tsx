import { useEffect } from "react";

export const DevToolsBlock = () => {
  useEffect(() => {
    const onContext = (e: MouseEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(k)) ||
        (e.metaKey && e.altKey && ["i", "j", "c"].includes(k)) ||
        (e.ctrlKey && ["u", "s"].includes(k)) ||
        (e.metaKey && ["u", "s"].includes(k))
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    window.addEventListener("contextmenu", onContext);
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("contextmenu", onContext);
      window.removeEventListener("keydown", onKey, true);
    };
  }, []);

  return null;
};


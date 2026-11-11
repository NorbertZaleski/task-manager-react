import { useEffect, type RefObject } from "react";

type UseDragScrollOptions = {
  edgeZone?: number;
  maxSpeed?: number;
  wheel?: boolean;
  keyboard?: boolean;
  axis?: "y" | "x";
};

export function useDragScroll(
  ref: RefObject<HTMLElement | null>,
  isDragging: boolean,
  opts: UseDragScrollOptions = {}
) {
  const {
    edgeZone = 150,
    maxSpeed = 18,
    wheel = true,
    keyboard = true,
    axis = "y",
  } = opts;

  useEffect(() => {
    if (!isDragging) return;
    const el = ref.current;
    if (!el) return;

    let velocity = 0;
    let raf = 0;

    const isOver = (x: number, y: number) => {
      const r = el.getBoundingClientRect();
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };

    const getScroll = () =>
      axis === "y" ? el.scrollTop : el.scrollLeft;

    const setScroll = (v: number) => {
      const max =
        axis === "y"
          ? el.scrollHeight - el.clientHeight
          : el.scrollWidth - el.clientWidth;
      const clamped = Math.max(0, Math.min(max, v));
      if (axis === "y") el.scrollTop = clamped;
      else el.scrollLeft = clamped;
    };

    const onDragOver = (e: DragEvent) => {
      if (!isOver(e.clientX, e.clientY)) { velocity = 0; return; }
      const r = el.getBoundingClientRect();
      const startDist = axis === "y" ? e.clientY - r.top : e.clientX - r.left;
      const endDist   = axis === "y" ? r.bottom - e.clientY : r.right - e.clientX;

      if (startDist < edgeZone) {
        velocity = -maxSpeed * (1 - Math.max(0, startDist) / edgeZone);
      } else if (endDist < edgeZone) {
        velocity = maxSpeed * (1 - Math.max(0, endDist) / edgeZone);
      } else {
        velocity = 0;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;
      if (!isOver(e.clientX, e.clientY)) return;

      e.preventDefault();

    let d = axis === "y" ? e.deltaY : (e.deltaX || e.deltaY);
      if (e.deltaMode === 1) d *= 16;
      else if (e.deltaMode === 2) d *= (axis === "y"
        ? el.clientHeight
        : el.clientWidth);

      setScroll(getScroll() + d);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      const page = (axis === "y" ? el.clientHeight : el.clientWidth) * 0.9;
      const step = 40;
      let handled = true;

      switch (e.key) {
        case "ArrowUp":   case "ArrowLeft":  setScroll(getScroll() - step);  break;
        case "ArrowDown": case "ArrowRight": setScroll(getScroll() + step);  break;
        case "PageUp":    setScroll(getScroll() - page); break;
        case "PageDown":  setScroll(getScroll() + page); break;
        case "Home":      setScroll(0); break;
        case "End":       setScroll(axis === "y" ? el.scrollHeight : el.scrollWidth); break;
        default: handled = false;
      }
      if (handled) e.preventDefault();
    };

    const stop = () => { velocity = 0; };

    window.addEventListener("dragover", onDragOver, true);
    window.addEventListener("dragend", stop);
    window.addEventListener("drop", stop);
    if (wheel)    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    if (keyboard) window.addEventListener("keydown", onKeyDown);

    const tick = () => {
      if (velocity !== 0) setScroll(getScroll() + velocity);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("dragover", onDragOver, true);
      window.removeEventListener("dragend", stop);
      window.removeEventListener("drop", stop);
      if (wheel)    window.removeEventListener("wheel", onWheel, true);
      if (keyboard) window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [isDragging, ref, edgeZone, maxSpeed, wheel, keyboard, axis]);
}
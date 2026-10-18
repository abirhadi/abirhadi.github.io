import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

const clampRate = (rate: number) => Math.max(-8, Math.min(8, rate));

export function useGlobeDrag(
  diagramRef: RefObject<SVGSVGElement | null>,
  enabled: boolean,
) {
  const motion = useRef({
    rate: 1,
    dragging: false,
    yawOffset: 0,
    pitchOffset: 0,
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram || !enabled) return;
    const controller = motion.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let drag:
      | {
          id: number;
          x: number;
          y: number;
          time: number;
          moved: boolean;
          radiansPerPixel: number;
        }
      | undefined;
    const finish = (event?: Event) => {
      if (!drag) return;
      const pointer = event as PointerEvent | undefined;
      if (
        pointer &&
        pointer.pointerId !== undefined &&
        pointer.pointerId !== drag.id
      )
        return;
      const id = drag.id;
      // Holding the globe still after a drag brings the momentum to rest.
      if (drag.moved && pointer && pointer.timeStamp - drag.time > 120)
        motion.current.rate = 0;
      drag = undefined;
      controller.dragging = false;
      setDragging(false);
      if (diagram.hasPointerCapture?.(id)) diagram.releasePointerCapture(id);
    };
    const start = (event: PointerEvent) => {
      if (
        event.button !== 0 ||
        event.pointerType === "touch" ||
        event.isPrimary === false ||
        drag
      )
        return;
      const rect = diagram.getBoundingClientRect();
      if (!rect.width) return;
      event.preventDefault();
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        moved: false,
        radiansPerPixel: Math.PI / rect.width,
      };
      motion.current.dragging = true;
      setDragging(true);
      diagram.setPointerCapture?.(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const elapsed = Math.max(8, event.timeStamp - drag.time);
      const sensitivity =
        drag.radiansPerPixel * (reducedMotion.matches ? 0.5 : 1);
      motion.current.yawOffset += dx * sensitivity;
      motion.current.pitchOffset = Math.max(
        -1,
        Math.min(1, motion.current.pitchOffset + dy * sensitivity),
      );
      if (dx !== 0 || dy !== 0) {
        const baseVelocity =
          (Math.PI * 2) / (reducedMotion.matches ? 80000 : 40000);
        const measuredRate = clampRate(
          (dx * sensitivity) / elapsed / baseVelocity,
        );
        // Filter noisy pointer samples; retain the chosen momentum after release.
        motion.current.rate = clampRate(
          motion.current.rate * 0.35 + measuredRate * 0.65,
        );
        drag.moved = true;
      }
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.time = event.timeStamp;
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    const hide = () => {
      if (document.hidden) finish();
    };
    diagram.addEventListener("pointerdown", start);
    diagram.addEventListener("lostpointercapture", finish);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    window.addEventListener("blur", finish);
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", hide);
    return () => {
      diagram.removeEventListener("pointerdown", start);
      diagram.removeEventListener("lostpointercapture", finish);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      window.removeEventListener("blur", finish);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", hide);
      if (drag && diagram.hasPointerCapture?.(drag.id))
        diagram.releasePointerCapture(drag.id);
      controller.dragging = false;
    };
  }, [diagramRef, enabled]);

  return { motion, dragging };
}

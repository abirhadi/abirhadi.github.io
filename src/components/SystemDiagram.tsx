import { useEffect, useRef } from "react";
import { globeRings, initialGlobe, projectGlobe } from "./globeGeometry";
import { useGlobeDrag } from "./useGlobeDrag";

const restingSpokes = "M133 168 280 270 430 157M280 270 329 439";

export function SystemDiagram({
  variant = "hero",
}: {
  variant?: "hero" | "compact";
}) {
  const diagramRef = useRef<SVGSVGElement>(null);
  const { motion, dragging } = useGlobeDrag(diagramRef, variant === "hero");
  const spinAngle = useRef(0);
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram || variant !== "hero") return;
    const front = diagram.querySelectorAll<SVGPathElement>(
      ".diagram-ring-front",
    );
    const back = diagram.querySelectorAll<SVGPathElement>(".diagram-ring-back");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | undefined;
    let previousTime: number | undefined;
    let visible = true;
    let lastYaw: number | undefined;
    let lastPitch: number | undefined;
    const renderFrame = (time: number) => {
      frame = undefined;
      if (document.hidden || !visible) {
        previousTime = undefined;
        return;
      }
      const elapsed = Math.min(time - (previousTime ?? time - 16), 64);
      previousTime = time;
      // This explicit autoplay request starts in either system setting. Reduced
      // motion uses half speed and a smaller pitch excursion.
      if (!motion.current.dragging)
        spinAngle.current +=
          (elapsed * Math.PI * 2 * motion.current.rate) /
          (reducedMotion.matches ? 80000 : 40000);
      const yaw = spinAngle.current + motion.current.yawOffset;
      const pitch =
        Math.sin(yaw * 0.6) * (reducedMotion.matches ? 0.12 : 0.3) +
        motion.current.pitchOffset;
      if (yaw !== lastYaw || pitch !== lastPitch) {
        const paths = projectGlobe(yaw, pitch);
        paths.forEach((path, i) => {
          front[i].setAttribute("d", path.front);
          back[i].setAttribute("d", path.back);
        });
        lastYaw = yaw;
        lastPitch = pitch;
      }
      frame = requestAnimationFrame(renderFrame);
    };
    const schedule = () => {
      if (frame === undefined && visible && !document.hidden)
        frame = requestAnimationFrame(renderFrame);
    };
    const suspend = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = previousTime = undefined;
    };
    const visibilityChanged = () => {
      if (document.hidden) suspend();
      else schedule();
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => {
            visible = entries[0]?.isIntersecting ?? false;
            if (visible) schedule();
            else suspend();
          })
        : undefined;
    observer?.observe(diagram);
    document.addEventListener("visibilitychange", visibilityChanged);
    schedule();
    return () => {
      suspend();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibilityChanged);
    };
  }, [variant, motion]);
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram || variant !== "hero") return;

    const surface = diagram.closest<HTMLElement>("#home") ?? diagram;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const guides = diagram.querySelector<SVGGElement>(".diagram-guide-follow")!;
    const orbit = diagram.querySelector<SVGGElement>(".diagram-orbit-follow")!;
    const network = diagram.querySelector<SVGGElement>(
      ".diagram-network-follow",
    )!;
    const center = diagram.querySelector<SVGGElement>(
      ".diagram-center-follow",
    )!;
    const spokes = diagram.querySelector<SVGPathElement>(".diagram-spokes")!;
    const halos =
      diagram.querySelectorAll<SVGCircleElement>(".diagram-node-halo");
    const current = { x: 0, y: 0, active: 0 };
    const target = { ...current };
    let frame: number | undefined;
    let previousTime: number | undefined;

    const paint = () => {
      // Native SVG transforms update the visible geometry directly. Reduced
      // motion keeps a small, immediate pointer response without rotation/easing.
      const strength = reducedMotion.matches ? 0.2 : 1;
      const x = current.x * strength;
      const y = current.y * strength;
      const turn = reducedMotion.matches ? 0 : x * 18;
      const tilt = reducedMotion.matches ? 0 : y * 8;
      const n = (value: number) => Number(value.toFixed(4));
      guides.setAttribute("transform", `translate(${n(-x * 5)} ${n(-y * 4)})`);
      orbit.setAttribute(
        "transform",
        `translate(${n(x * 36)} ${n(y * 28)}) translate(280 270) rotate(${n(turn)}) skewX(${n(tilt)}) translate(-280 -270)`,
      );
      network.setAttribute(
        "transform",
        `translate(${n(x * 36)} ${n(y * 28)}) rotate(${n(turn / 4)} 280 270)`,
      );
      const centerX = n(x * 14);
      const centerY = n(y * 12);
      center.setAttribute("transform", `translate(${centerX} ${centerY})`);
      // Keep all three spokes attached as the center drifts within the globe.
      spokes.setAttribute(
        "d",
        `M133 168 ${n(280 + centerX)} ${n(270 + centerY)} 430 157M${n(280 + centerX)} ${n(270 + centerY)} 329 439`,
      );
      halos.forEach((halo) =>
        halo.setAttribute("opacity", String(n(0.15 + current.active * 0.13))),
      );
    };
    const animate = (time: number) => {
      const elapsed = Math.min(time - (previousTime ?? time - 16), 64);
      previousTime = time;
      // Time-based easing keeps the response consistent across refresh rates.
      const blend = 1 - Math.exp(-elapsed / 95);
      let settled = true;
      for (const key of ["x", "y", "active"] as const) {
        current[key] += (target[key] - current[key]) * blend;
        if (Math.abs(target[key] - current[key]) < 0.001) {
          current[key] = target[key];
        } else settled = false;
      }
      paint();
      // No perpetual animation loop: stop as soon as the pointer response settles.
      frame = settled ? undefined : requestAnimationFrame(animate);
      if (settled) previousTime = undefined;
    };
    const schedule = () => {
      if (frame === undefined) frame = requestAnimationFrame(animate);
    };
    const follow = (event: Event) => {
      const pointer = event as PointerEvent;
      if (pointer.pointerType === "touch") return;
      const rect = diagram.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      target.x = Math.max(
        -1,
        Math.min(1, ((pointer.clientX - rect.left) / rect.width) * 2 - 1),
      );
      target.y = Math.max(
        -1,
        Math.min(1, ((pointer.clientY - rect.top) / rect.height) * 2 - 1),
      );
      target.active = 1;
      if (reducedMotion.matches) {
        Object.assign(current, target);
        paint();
      } else schedule();
    };
    const recenter = () => {
      target.x = target.y = target.active = 0;
      if (reducedMotion.matches) {
        Object.assign(current, target);
        paint();
      } else schedule();
    };
    const reset = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = previousTime = undefined;
      current.x = current.y = current.active = 0;
      target.x = target.y = target.active = 0;
      guides.removeAttribute("transform");
      orbit.removeAttribute("transform");
      network.removeAttribute("transform");
      center.removeAttribute("transform");
      spokes.setAttribute("d", restingSpokes);
      halos.forEach((halo) => halo.setAttribute("opacity", ".15"));
    };
    const preferenceChanged = () => {
      if (reducedMotion.matches) reset();
    };
    const visibilityChanged = () => {
      if (document.hidden) reset();
    };

    surface.addEventListener("pointermove", follow, { passive: true });
    surface.addEventListener("pointerleave", recenter);
    surface.addEventListener("pointercancel", recenter);
    window.addEventListener("blur", recenter);
    document.addEventListener("visibilitychange", visibilityChanged);
    reducedMotion.addEventListener("change", preferenceChanged);
    return () => {
      surface.removeEventListener("pointermove", follow);
      surface.removeEventListener("pointerleave", recenter);
      surface.removeEventListener("pointercancel", recenter);
      window.removeEventListener("blur", recenter);
      document.removeEventListener("visibilitychange", visibilityChanged);
      reducedMotion.removeEventListener("change", preferenceChanged);
      reset();
    };
  }, [variant]);

  return (
    <div className="diagram-shell" data-dragging={dragging}>
      <svg
        ref={diagramRef}
        className={`system-diagram ${variant}`}
        viewBox="0 0 560 540"
        fill="none"
        role="img"
        aria-labelledby={`diagram-title-${variant} diagram-desc-${variant}`}
      >
        <title id={`diagram-title-${variant}`}>
          Learning, adaptation, and verification
        </title>
        <desc id={`diagram-desc-${variant}`}>
          A conceptual network connects three research directions around an
          evolving central structure. This is conceptual artwork, not an
          experimental result.
        </desc>
        <defs>
          <pattern
            id={`grid-${variant}`}
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".17" />
          </pattern>
        </defs>
        <rect width="560" height="540" fill={`url(#grid-${variant})`} />
        <g className="diagram-guide-follow" stroke="currentColor" opacity=".18">
          <path d="M280 40v460M50 270h460" strokeDasharray="3 7" />
          <circle cx="280" cy="270" r="191" />
          <circle cx="280" cy="270" r="225" strokeDasharray="2 9" />
        </g>
        <g className="diagram-orbit-follow">
          <g
            className="orbital-structure"
            stroke="currentColor"
            strokeWidth=".8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {initialGlobe.map((ring, i) => (
              <path
                key={`${ring.id}-back`}
                className="diagram-ring-back"
                d={ring.back}
                opacity={globeRings[i].opacity * 0.36}
              />
            ))}
            {initialGlobe.map((ring, i) => (
              <path
                key={`${ring.id}-front`}
                className="diagram-ring-front"
                d={ring.front}
                opacity={globeRings[i].opacity + 0.04}
              />
            ))}
          </g>
        </g>
        <g className="diagram-network-follow">
          <g stroke="currentColor" strokeWidth="1">
            <path className="diagram-spokes" d={restingSpokes} opacity=".5" />
            <path
              d="m133 168 297-11-101 282Z"
              strokeDasharray="4 6"
              opacity=".3"
            />
          </g>
          <g className="diagram-node">
            <circle cx="133" cy="168" r="8" />
            <circle
              className="diagram-node-halo"
              cx="133"
              cy="168"
              r="18"
              opacity=".15"
            />
          </g>
          <g className="diagram-node">
            <circle cx="430" cy="157" r="6" />
            <circle
              className="diagram-node-halo"
              cx="430"
              cy="157"
              r="14"
              opacity=".15"
            />
          </g>
          <g className="diagram-node accent-node">
            <circle cx="329" cy="439" r="7" />
            <circle
              className="diagram-node-halo"
              cx="329"
              cy="439"
              r="17"
              opacity=".15"
            />
          </g>
          <g className="diagram-center-follow">
            <circle cx="280" cy="270" r="5" fill="currentColor" />
            <circle
              cx="280"
              cy="270"
              r="13"
              stroke="currentColor"
              opacity=".4"
            />
          </g>
        </g>
        <path
          d="M26 45V26h19M515 26h19v19M26 495v19h19M515 514h19v-19"
          stroke="currentColor"
          opacity=".4"
        />
      </svg>
    </div>
  );
}

import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SystemDiagram } from "../components/SystemDiagram";
import * as geometry from "../components/globeGeometry";

afterEach(() => vi.unstubAllGlobals());

function pointerMove(element: Element, pointerType = "mouse") {
  const event = new MouseEvent("pointermove", { clientX: 1000, clientY: 600 });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(element, event);
}

function dragPointer(
  target: Element | Window,
  type: string,
  x: number,
  y: number,
  time: number,
) {
  const event = new MouseEvent(type, {
    clientX: x,
    clientY: y,
    button: 0,
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperties(event, {
    pointerType: { value: "mouse" },
    pointerId: { value: 1 },
    timeStamp: { value: time },
  });
  fireEvent(target, event);
}

function animationHarness() {
  let nextId = 0,
    time = 0;
  const pending = new Map<number, FrameRequestCallback>();
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn((callback: FrameRequestCallback) => {
      pending.set(++nextId, callback);
      return nextId;
    }),
  );
  vi.stubGlobal(
    "cancelAnimationFrame",
    vi.fn((id: number) => pending.delete(id)),
  );
  return {
    pending,
    advance: (frames = 100) => {
      for (let i = 0; i < frames && pending.size; i++) {
        time += 16;
        const callbacks = [...pending.values()];
        pending.clear();
        callbacks.forEach((callback) => callback(time));
      }
    },
  };
}

function scene() {
  const animation = animationHarness();
  const projection = vi.spyOn(geometry, "projectGlobe");
  const view = render(
    <section id="home">
      <SystemDiagram />
    </section>,
  );
  const diagram = screen.getByRole("img");
  const hero = view.container.querySelector("section")!;
  vi.spyOn(diagram, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 1000, 600),
  );
  const yaw = () => projection.mock.calls.at(-1)?.[0] ?? 0;
  const velocity = () => {
    animation.advance(1);
    const before = yaw();
    animation.advance(2);
    return (yaw() - before) / 32;
  };
  return { ...view, animation, diagram, hero, velocity };
}

describe("Hero diagram interactions", () => {
  it("accelerates, slows, reverses and retains momentum after release outside the globe", () => {
    const { animation, container, diagram, velocity } = scene();
    const baseline = velocity();
    dragPointer(diagram, "pointerdown", 500, 300, 0);
    dragPointer(window, "pointermove", 580, 320, 16);
    expect(
      container.querySelector(".diagram-shell")?.getAttribute("data-dragging"),
    ).toBe("true");
    animation.advance(2);
    const ring = diagram.querySelector(".diagram-ring-front")!;
    const heldPose = ring.getAttribute("d");
    animation.advance(2);
    expect(ring.getAttribute("d")).toBe(heldPose);
    dragPointer(window, "pointerup", 580, 320, 32);
    expect(
      container.querySelector(".diagram-shell")?.getAttribute("data-dragging"),
    ).toBe("false");
    const faster = velocity();
    expect(faster).toBeGreaterThan(baseline);
    expect(ring.getAttribute("d")).not.toBe(heldPose);
    expect(velocity()).toBeCloseTo(faster, 6);
    dragPointer(diagram, "pointerdown", 500, 300, 100);
    dragPointer(window, "pointermove", 499, 300, 140);
    dragPointer(window, "pointerup", 499, 300, 150);
    expect(Math.abs(velocity())).toBeLessThan(faster);
    dragPointer(diagram, "pointerdown", 500, 300, 200);
    dragPointer(window, "pointermove", 420, 300, 216);
    dragPointer(window, "pointerup", 420, 300, 230);
    expect(velocity()).toBeLessThan(0);
  });

  it("stops when held still and resumes with another drag", () => {
    const { animation, diagram, velocity } = scene();
    dragPointer(diagram, "pointerdown", 500, 300, 0);
    dragPointer(window, "pointermove", 580, 300, 16);
    dragPointer(window, "pointerup", 580, 300, 250);
    animation.advance(2);
    const ring = diagram.querySelector(".diagram-ring-front")!;
    const stoppedPose = ring.getAttribute("d");
    expect(velocity()).toBe(0);
    expect(ring.getAttribute("d")).toBe(stoppedPose);
    dragPointer(diagram, "pointerdown", 500, 300, 400);
    dragPointer(window, "pointermove", 580, 300, 416);
    dragPointer(window, "pointerup", 580, 300, 430);
    expect(velocity()).toBeGreaterThan(0);
    expect(ring.getAttribute("d")).not.toBe(stoppedPose);
  });

  it("autoplays 3D geometry and preserves center movement without visible controls or legends", () => {
    const { animation, container, diagram, hero } = scene();
    const ring = diagram.querySelector(".diagram-ring-front")!;
    const restingRing = ring.getAttribute("d");
    expect(animation.pending.size).toBe(1);
    animation.advance(12);
    expect(ring.getAttribute("d")).not.toBe(restingRing);
    pointerMove(hero);
    animation.advance();
    expect(
      diagram
        .querySelector(".diagram-center-follow")
        ?.getAttribute("transform"),
    ).toBe("translate(14 12)");
    expect(
      container.querySelector("button,output,svg text,.diagram-drag-hint"),
    ).toBeNull();
  });

  it("follows the pointer and recenters while autoplay continues", () => {
    const { animation, diagram, hero } = scene();
    pointerMove(hero);
    animation.advance();
    const center = diagram.querySelector(".diagram-center-follow")!;
    const orbit = diagram.querySelector(".diagram-orbit-follow")!;
    const spokes = diagram.querySelector(".diagram-spokes")!;
    expect(center.getAttribute("transform")).toBe("translate(14 12)");
    expect(orbit.getAttribute("transform")).toContain("translate(36 28)");
    expect(spokes.getAttribute("d")).toBe(
      "M133 168 294 282 430 157M294 282 329 439",
    );
    expect(animation.pending.size).toBe(1);
    fireEvent.pointerLeave(hero);
    animation.advance();
    expect(center.getAttribute("transform")).toBe("translate(0 0)");
    expect(orbit.getAttribute("transform")).toContain("translate(0 0)");
    expect(spokes.getAttribute("d")).toBe(
      "M133 168 280 270 430 157M280 270 329 439",
    );
    expect(animation.pending.size).toBe(1);
  });

  it("ignores touch gestures and uses immediate smaller pointer movement with reduced motion", () => {
    const first = scene();
    pointerMove(first.hero, "touch");
    expect(first.animation.pending.size).toBe(1);
    expect(
      first.diagram
        .querySelector(".diagram-center-follow")
        ?.getAttribute("transform"),
    ).toBeNull();
    first.unmount();
    vi.stubGlobal(
      "matchMedia",
      vi
        .fn()
        .mockReturnValue({
          matches: true,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        } as unknown as MediaQueryList),
    );
    const reduced = scene();
    pointerMove(reduced.hero);
    expect(reduced.animation.pending.size).toBe(1);
    expect(
      reduced.diagram
        .querySelector(".diagram-center-follow")
        ?.getAttribute("transform"),
    ).toBe("translate(2.8 2.4)");
  });

  it("cancels animation and removes pointer listeners on unmount", () => {
    const { animation, hero, unmount } = scene();
    pointerMove(hero);
    expect(animation.pending.size).toBe(2);
    unmount();
    expect(animation.pending.size).toBe(0);
    pointerMove(hero);
    expect(animation.pending.size).toBe(0);
  });
});

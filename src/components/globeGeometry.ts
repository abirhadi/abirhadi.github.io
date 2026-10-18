type Point3 = { x: number; y: number; z: number };

const segments = 72;
const radians = Math.PI / 180;

// Lift the existing tilted ellipses and latitude bands into three dimensions.
// Their original radii, spacing, and line weights define the resting design.
export const globeRings = [
  ...Array.from({ length: 13 }, (_, i) => {
    const radius = 35 + i * 12;
    const depth = Math.sqrt(179 ** 2 - radius ** 2);
    const angle = i * 14 * radians;
    return {
      id: `meridian-${i}`,
      opacity: 0.16 + i * 0.025,
      points: Array.from({ length: segments + 1 }, (_, segment): Point3 => {
        const t = (segment / segments) * Math.PI * 2;
        const x = radius * Math.cos(t);
        const y = 174 * Math.sin(t);
        return {
          x: x * Math.cos(angle) - y * Math.sin(angle),
          y: x * Math.sin(angle) + y * Math.cos(angle),
          z: depth * Math.cos(t),
        };
      }),
    };
  }),
  ...Array.from({ length: 7 }, (_, i) => {
    const radius = Math.sqrt(1 - ((i - 3) / 4) ** 2) * 170;
    return {
      id: `latitude-${i}`,
      opacity: 0.2,
      points: Array.from({ length: segments + 1 }, (_, segment): Point3 => {
        const t = (segment / segments) * Math.PI * 2;
        return {
          x: radius * Math.cos(t),
          y: -105 + i * 35 + (20 + i * 3) * Math.sin(t),
          z: radius * Math.sin(t),
        };
      }),
    };
  }),
];

export function projectGlobe(yaw: number, pitch: number) {
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  const project = (point: Point3): Point3 => {
    const x = point.x * cy + point.z * sy;
    const depth = -point.x * sy + point.z * cy;
    const y = point.y * cp - depth * sp;
    const z = point.y * sp + depth * cp;
    const perspective = 1000 / (1000 - z);
    return { x: 280 + x * perspective, y: 270 + y * perspective, z };
  };
  const xy = (point: Point3) =>
    `${Number(point.x.toFixed(2))} ${Number(point.y.toFixed(2))}`;

  return globeRings.map((ring) => {
    const points = ring.points.map(project);
    const front: string[] = [],
      back: string[] = [];
    let previousSide: boolean | undefined;
    const line = (near: boolean, a: Point3, b: Point3) => {
      const path = near ? front : back;
      path.push(`${previousSide === near ? "" : `M${xy(a)}`}L${xy(b)}`);
      previousSide = near;
    };
    for (let i = 0; i < segments; i++) {
      const a = points[i],
        b = points[i + 1];
      const nearA = a.z >= 0,
        nearB = b.z >= 0;
      if (nearA === nearB) line(nearA, a, b);
      else {
        const t = a.z / (a.z - b.z);
        const crossing = {
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          z: 0,
        };
        line(nearA, a, crossing);
        line(nearB, crossing, b);
      }
    }
    return { id: ring.id, front: front.join(""), back: back.join("") };
  });
}

export const initialGlobe = projectGlobe(0, 0);

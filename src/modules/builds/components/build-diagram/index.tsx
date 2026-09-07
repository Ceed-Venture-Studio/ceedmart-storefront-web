"use client"

import { clx } from "@medusajs/ui"

// A schematic of the machine being configured.
//
// The build sheet on its own is a list of names and numbers; it does not
// tell you what you have and haven't decided. The diagram does — a faded
// outline of the whole machine, with each part solid once it is chosen. It
// answers "what's left?" at a glance, which is the question a half-finished
// configuration actually raises.
//
// ── Proportions are real ────────────────────────────────────────────────
// The desktop is drawn as an ATX case seen from its open side: board top
// left, PSU shrouded along the bottom, GPU hanging off the board's lower
// slots, drive cage front-right. Someone who has built a PC should
// recognise the layout; someone who hasn't should still see that the big
// flat thing is the graphics card.
//
// ── State is not carried by colour alone ────────────────────────────────
// §12.3 forbids that. A chosen part gets a heavier stroke, a filled ground
// AND a tick; an unchosen one is a thin dashed outline. The difference
// survives greyscale and colour blindness.

export type DiagramState = {
  /** Category codes with a part chosen. */
  filled: Set<string>
  /** The slot currently being edited, highlighted so the eye can find it. */
  active?: string | null
}

type Props = DiagramState & {
  buildType: "desktop" | "laptop"
  /** Hovering a region focuses the matching dropdown, and vice versa. */
  onHover?: (code: string | null) => void
  onSelect?: (code: string) => void
}

// Slots with no physical place in the case — an OS, a warranty, a service.
// Drawing them would mean inventing a location, so they are listed beneath
// the diagram instead of being forced into it.
const NON_PHYSICAL = new Set([
  "operating_system",
  "services",
  "networking",
  "peripherals",
  "monitor",
])

const LABELS: Record<string, string> = {
  case: "Case",
  motherboard: "Motherboard",
  cpu: "Processor",
  cpu_cooler: "Cooler",
  memory: "Memory",
  gpu: "Graphics",
  storage: "Storage",
  psu: "Power supply",
  case_cooling: "Fans",
  laptop_model: "Chassis",
  laptop_display: "Screen",
  laptop_cpu: "Processor",
  laptop_memory: "Memory",
  laptop_keyboard: "Keyboard",
  laptop_battery: "Battery",
}

const Region = ({
  code,
  filled,
  active,
  onHover,
  onSelect,
  children,
}: {
  code: string
  filled: boolean
  active: boolean
  onHover?: (c: string | null) => void
  onSelect?: (c: string) => void
  children: React.ReactNode
}) => (
  <g
    className={clx(
      "transition-[opacity,filter] duration-200 cursor-pointer",
      filled ? "opacity-100" : "opacity-45",
      active && "opacity-100"
    )}
    onMouseEnter={() => onHover?.(code)}
    onMouseLeave={() => onHover?.(null)}
    onClick={() => onSelect?.(code)}
    role="button"
    tabIndex={0}
    aria-label={`${LABELS[code] ?? code}${filled ? " — chosen" : " — not chosen yet"}`}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onSelect?.(code)
      }
    }}
  >
    <title>
      {LABELS[code] ?? code}
      {filled ? " — chosen" : " — not chosen yet"}
    </title>
    {children}
  </g>
)

// Shared visual language for every part shape.
const partClass = (filled: boolean, active: boolean) =>
  clx(
    "transition-all duration-200",
    // Thin lines throughout. At 2.5 the outlines read as the subject; the
    // subject is the machine. The dash is finer too — a long dash on a small
    // part looked like a torn edge rather than an empty slot.
    filled
      ? "fill-ceedmart-navy/10 stroke-ceedmart-navy [stroke-width:1.25]"
      : "fill-transparent stroke-grey-50 [stroke-width:1.4] [stroke-dasharray:4_3]",
    active && "stroke-ceedmart-blue [stroke-width:1.75]"
  )

// Depth, in user units. Every part is extruded up and to the right by the
// same amount, which is what makes the scene read as one object lit from one
// direction rather than a pile of unrelated boxes.
const D = 9

/**
 * A part with thickness.
 *
 * Oblique projection, not isometric: the front face stays square, so labels
 * and ticks sit flat and legible, and only the top and right faces carry the
 * depth. A true isometric would skew every caption with it, and a diagram
 * whose job is to say WHICH PART IS WHICH cannot afford unreadable labels.
 *
 * The two side faces are drawn before the front so the front edge always
 * wins, and they are drawn without the dash: a dashed silhouette on an empty
 * slot is enough to say "not chosen" — dashing the sides as well turned every
 * unfilled part into a smudge.
 */
const Box = ({
  x,
  y,
  w,
  h,
  rx = 4,
  cls,
  depth = D,
}: {
  x: number
  y: number
  w: number
  h: number
  rx?: number
  cls: string
  depth?: number
}) => {
  const faces = cls
    .replace(/\[stroke-dasharray:[^\]]*\]/g, "")
    .replace(/fill-transparent/, "fill-grey-10/40")
    .replace(/fill-ceedmart-navy\/10/, "fill-ceedmart-navy/20")

  return (
    <g>
      {/* top */}
      <path
        d={`M ${x + rx} ${y} L ${x + rx + depth} ${y - depth} L ${x + w + depth} ${y - depth} L ${x + w} ${y} Z`}
        className={faces}
      />
      {/* right */}
      <path
        d={`M ${x + w} ${y} L ${x + w + depth} ${y - depth} L ${x + w + depth} ${y + h - depth - rx} L ${x + w} ${y + h - rx} Z`}
        className={faces}
      />
      <rect x={x} y={y} width={w} height={h} rx={rx} className={cls} />
    </g>
  )
}

/** A tick in the corner of a chosen part — the non-colour signal. */
const Tick = ({ x, y, show }: { x: number; y: number; show: boolean }) =>
  show ? (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} r="8" className="fill-ceedmart-navy" />
      <path
        d={`M ${x - 3.5} ${y} l 2.5 2.5 l 4.5 -5`}
        className="stroke-white [stroke-width:2] fill-none [stroke-linecap:round] [stroke-linejoin:round]"
      />
    </g>
  ) : null

const Caption = ({
  x,
  y,
  children,
  anchor = "middle",
}: {
  x: number
  y: number
  children: React.ReactNode
  anchor?: "start" | "middle" | "end"
}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    className="fill-ui-fg-muted [font-size:11px] pointer-events-none select-none"
  >
    {children}
  </text>
)

// ─── Desktop ──────────────────────────────────────────────────────────────

// ─── Isometric helpers ────────────────────────────────────────────────────
//
// The laptop is drawn in true isometric rather than as extruded rectangles,
// because a laptop is a recognisable object and a stack of boxes is not.
// Coordinates are given in machine space — x across the chassis, y back into
// it, z up — and projected here, so the drawing below reads as measurements
// of a laptop rather than as SVG path soup.

const ISO_X = 0.866 // cos 30°
const ISO_Y = 0.5 // sin 30°

const iso = (x: number, y: number, z = 0): [number, number] => [
  (x - y) * ISO_X,
  (x + y) * ISO_Y - z,
]

const poly = (points: [number, number, number][]): string =>
  points.map((p) => iso(...p).join(",")).join(" ")

/** A flat isometric panel: four corners on one z plane. */
const Panel = ({
  x,
  y,
  w,
  d,
  z = 0,
  cls,
}: {
  x: number
  y: number
  w: number
  d: number
  z?: number
  cls: string
}) => (
  <polygon
    points={poly([
      [x, y, z],
      [x + w, y, z],
      [x + w, y + d, z],
      [x, y + d, z],
    ])}
    className={cls}
  />
)

/**
 * A component sitting on the chassis floor: a slab with visible thickness.
 *
 * Top face plus the two walls that face the viewer, which in this projection
 * are the +x and +y sides. Drawing all six would be wasted ink — the others
 * are never visible.
 */
const Slab = ({
  x,
  y,
  w,
  d,
  h = 6,
  z = 0,
  cls,
}: {
  x: number
  y: number
  w: number
  d: number
  h?: number
  z?: number
  cls: string
}) => (
  <g>
    <polygon
      points={poly([
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h],
      ])}
      className={cls}
    />
    <polygon
      points={poly([
        [x, y + d, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x, y + d, z],
      ])}
      className={cls}
    />
    <polygon
      points={poly([
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x + w, y, z],
      ])}
      className={cls}
    />
  </g>
)

/**
 * A vertical face at a constant y — the plane the motherboard lives on.
 *
 * The laptop only needed horizontal panels; a tower is mostly vertical, and
 * the board is the surface everything else mounts to.
 */
const FaceXZ = ({
  x,
  z,
  w,
  h,
  y,
  cls,
}: {
  x: number
  z: number
  w: number
  h: number
  y: number
  cls: string
}) => (
  <polygon
    points={poly([
      [x, y, z],
      [x + w, y, z],
      [x + w, y, z + h],
      [x, y, z + h],
    ])}
    className={cls}
  />
)

/**
 * A box with its three visible faces.
 *
 * In this projection the viewer sees the top and the two walls with the
 * greater x and y, so the other three are never drawn. Used for parts that
 * stand proud of the board — the cooler, the graphics card, the power
 * supply — where a flat panel would not read as a component.
 */
const Box3 = ({
  x,
  y,
  z,
  w,
  d,
  h,
  cls,
}: {
  x: number
  y: number
  z: number
  w: number
  d: number
  h: number
  cls: string
}) => (
  <g>
    <polygon
      points={poly([
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h],
      ])}
      className={cls}
    />
    <polygon
      points={poly([
        [x, y + d, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x, y + d, z],
      ])}
      className={cls}
    />
    <polygon
      points={poly([
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x + w, y + d, z],
        [x + w, y, z],
      ])}
      className={cls}
    />
  </g>
)

/** A label that stays upright over an isometric point. */
const IsoLabel = ({
  x,
  y,
  z = 0,
  dx = 0,
  dy = 0,
  children,
}: {
  x: number
  y: number
  z?: number
  dx?: number
  dy?: number
  children: React.ReactNode
}) => {
  const [px, py] = iso(x, y, z)
  return (
    <text
      x={px + dx}
      y={py + dy}
      textAnchor="middle"
      className="fill-ui-fg-muted text-[11px] pointer-events-none select-none"
    >
      {children}
    </text>
  )
}

const Desktop = ({ filled, active, onHover, onSelect }: Props) => {
  const is = (c: string) => filled.has(c)
  const on = (c: string) => active === c
  const r = (c: string) => partClass(is(c), on(c))

  // A tower with the near side panel off, which is how anyone who has opened
  // a PC has seen one. Machine space: x across the case, y from the far wall
  // toward the viewer, z up.
  //
  // The motherboard is a vertical plane against the far wall and everything
  // else mounts to it and stands proud toward us — the cooler above the
  // chip, memory in its slots, the card horizontal below, the supply in the
  // basement. That arrangement is the point: it is what makes a case feel
  // like somewhere parts go rather than a list with a border.
  const W = 250 // across
  const Dp = 210 // depth
  const H = 430 // height
  const BOARD_Y = 12 // the board sits just off the far wall

  return (
    <svg
      viewBox="-205 -460 440 720"
      className="w-full h-auto"
      // Capped against the viewport so the first few dropdowns are on screen
      // with the diagram, rather than below a full-height tower.
      style={{ maxHeight: "min(46vh, 430px)" }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Desktop PC build diagram, side panel removed"
    >
      {/* ── Case shell. The +y wall is omitted: that is the panel taken off. */}
      <Region code="case" filled={is("case")} active={on("case")} onHover={onHover} onSelect={onSelect}>
        {/* far wall, the surface the board bolts to */}
        <FaceXZ x={0} z={0} w={W} h={H} y={0} cls={r("case")} />
        {/* right wall */}
        <polygon
          points={poly([
            [W, 0, 0],
            [W, Dp, 0],
            [W, Dp, H],
            [W, 0, H],
          ])}
          className={r("case")}
        />
        {/* floor and roof */}
        <Panel x={0} y={0} w={W} d={Dp} cls={r("case")} />
        <Panel x={0} y={0} w={W} d={Dp} z={H} cls={r("case")} />
        {/* the open edge, drawn as a thin lip so the removed panel reads as
            removed rather than as a drawing that forgot a side */}
        <polyline
          points={poly([
            [0, Dp, 0],
            [W, Dp, 0],
            [W, Dp, H],
            [0, Dp, H],
            [0, Dp, 0],
          ])}
          className="fill-none stroke-grey-30 [stroke-width:0.8] [stroke-dasharray:3_3]"
        />
        <IsoLabel x={0} y={Dp} z={H + 24}>
          Case
        </IsoLabel>
      </Region>

      {/* ── Front intake fans, on the far-left face ─────────────────────── */}
      <Region code="case_cooling" filled={is("case_cooling")} active={on("case_cooling")} onHover={onHover} onSelect={onSelect}>
        {[110, 250].map((cz) => {
          const [cx, cy] = iso(0, Dp / 2, cz)
          return (
            <g key={cz}>
              <ellipse cx={cx} cy={cy} rx={13} ry={30} className={r("case_cooling")} />
              <ellipse
                cx={cx}
                cy={cy}
                rx={5}
                ry={11}
                className="fill-transparent stroke-grey-30 [stroke-width:0.7]"
              />
            </g>
          )
        })}
        <IsoLabel x={0} y={Dp / 2} z={330} dy={-6}>
          Fans
        </IsoLabel>
      </Region>

      {/* ── Motherboard ─────────────────────────────────────────────────── */}
      <Region code="motherboard" filled={is("motherboard")} active={on("motherboard")} onHover={onHover} onSelect={onSelect}>
        <FaceXZ x={34} z={96} w={W - 68} h={286} y={BOARD_Y} cls={r("motherboard")} />
        <IsoLabel x={W - 52} y={BOARD_Y} z={118}>
          Board
        </IsoLabel>
      </Region>

      {/* ── Processor, then the cooler standing on it ───────────────────── */}
      <Region code="cpu" filled={is("cpu")} active={on("cpu")} onHover={onHover} onSelect={onSelect}>
        <Box3 x={58} y={BOARD_Y} z={272} w={62} d={20} h={14} cls={r("cpu")} />
        <IsoLabel x={89} y={BOARD_Y + 20} z={266} dy={12}>
          CPU
        </IsoLabel>
      </Region>

      <Region code="cpu_cooler" filled={is("cpu_cooler")} active={on("cpu_cooler")} onHover={onHover} onSelect={onSelect}>
        <Box3 x={52} y={BOARD_Y} z={288} w={74} d={64} h={92} cls={r("cpu_cooler")} />
        {/* fan face on the near side of the tower */}
        {(() => {
          const [fx, fy] = iso(89, BOARD_Y + 64, 334)
          return (
            <>
              <ellipse cx={fx} cy={fy} rx={16} ry={30} className={r("cpu_cooler")} />
              <ellipse
                cx={fx}
                cy={fy}
                rx={6}
                ry={11}
                className="fill-transparent stroke-grey-30 [stroke-width:0.7]"
              />
            </>
          )
        })()}
        <IsoLabel x={89} y={BOARD_Y + 64} z={388}>
          Cooler
        </IsoLabel>
      </Region>

      {/* ── Memory: sticks standing in their slots ──────────────────────── */}
      <Region code="memory" filled={is("memory")} active={on("memory")} onHover={onHover} onSelect={onSelect}>
        {[0, 1, 2, 3].map((i) => (
          <Box3
            key={i}
            x={148 + i * 18}
            y={BOARD_Y}
            z={266}
            w={9}
            d={14}
            h={104}
            cls={r("memory")}
          />
        ))}
        <IsoLabel x={183} y={BOARD_Y + 14} z={392}>
          RAM
        </IsoLabel>
      </Region>

      {/* ── Graphics card, horizontal in the top slot ───────────────────── */}
      <Region code="gpu" filled={is("gpu")} active={on("gpu")} onHover={onHover} onSelect={onSelect}>
        <Box3 x={44} y={BOARD_Y} z={196} w={W - 96} d={92} h={26} cls={r("gpu")} />
        <IsoLabel x={120} y={BOARD_Y + 92} z={236}>
          Graphics
        </IsoLabel>
      </Region>

      {/* ── Storage, in a bay against the near-right ────────────────────── */}
      <Region code="storage" filled={is("storage")} active={on("storage")} onHover={onHover} onSelect={onSelect}>
        <Box3 x={168} y={126} z={98} w={62} d={72} h={22} cls={r("storage")} />
        <Box3 x={168} y={126} z={128} w={62} d={72} h={22} cls={r("storage")} />
        <IsoLabel x={199} y={198} z={162} dy={-8}>
          Storage
        </IsoLabel>
      </Region>

      {/* ── Power supply, in the basement ───────────────────────────────── */}
      <Region code="psu" filled={is("psu")} active={on("psu")} onHover={onHover} onSelect={onSelect}>
        <Box3 x={24} y={BOARD_Y} z={14} w={128} d={104} h={68} cls={r("psu")} />
        {(() => {
          const [px, py] = iso(88, BOARD_Y + 104, 48)
          return (
            <>
              <ellipse cx={px} cy={py} rx={17} ry={30} className={r("psu")} />
              <ellipse
                cx={px}
                cy={py}
                rx={6}
                ry={11}
                className="fill-transparent stroke-grey-30 [stroke-width:0.7]"
              />
            </>
          )
        })()}
        <IsoLabel x={70} y={BOARD_Y + 104} z={94} dy={14}>
          Power
        </IsoLabel>
      </Region>
    </svg>
  )
}

const Laptop = ({ filled, active, onHover, onSelect }: Props) => {
  const is = (c: string) => filled.has(c)
  const on = (c: string) => active === c
  const r = (c: string) => partClass(is(c), on(c))

  // Machine space, in millimetres-ish. The base is a shallow tray; the
  // bottom cover floats above it, which is the only view in which the
  // battery, drive, memory and processor are all visible at once — the
  // reason a real service drawing uses it.
  const W = 300 // across
  const Dp = 210 // front to back
  const WALL = 10 // chassis wall
  const LIFT = 250 // clears the tray: the tray is 255 units tall on screen

  return (
    <svg
      viewBox="-330 -268 600 640"
      className="w-full h-auto"
      style={{ maxHeight: "min(40vh, 380px)" }}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Laptop build diagram, bottom cover removed"
    >
      {/* ── Screen, hinged at the back and folded down behind ───────────── */}
      <Region code="laptop_display" filled={is("laptop_display")} active={on("laptop_display")} onHover={onHover} onSelect={onSelect}>
        <Panel x={0} y={Dp + 6} w={W} d={158} cls={r("laptop_display")} />
        <Panel
          x={16}
          y={Dp + 22}
          w={W - 32}
          d={128}
          z={0.4}
          cls="fill-transparent stroke-grey-30 [stroke-width:0.7]"
        />
        <IsoLabel x={W / 2} y={Dp + 86}>
          Screen
        </IsoLabel>
      </Region>

      {/* ── Chassis tray ────────────────────────────────────────────────── */}
      <g className="pointer-events-none">
        {/* outer walls */}
        <polygon
          points={poly([
            [0, 0, 0],
            [W, 0, 0],
            [W, 0, -22],
            [0, 0, -22],
          ])}
          className="fill-grey-10/50 stroke-grey-40 [stroke-width:1]"
        />
        <polygon
          points={poly([
            [W, 0, 0],
            [W, Dp, 0],
            [W, Dp, -22],
            [W, 0, -22],
          ])}
          className="fill-grey-10/50 stroke-grey-40 [stroke-width:1]"
        />
        {/* floor */}
        <Panel x={0} y={0} w={W} d={Dp} cls="fill-white stroke-grey-40 [stroke-width:1]" />
        {/* inner lip, so the tray reads as having walls rather than being flat */}
        <Panel
          x={WALL}
          y={WALL}
          w={W - WALL * 2}
          d={Dp - WALL * 2}
          cls="fill-transparent stroke-grey-30 [stroke-width:0.8]"
        />
      </g>

      {/* ── Battery: the big slab across the front ──────────────────────── */}
      <Region code="laptop_battery" filled={is("laptop_battery")} active={on("laptop_battery")} onHover={onHover} onSelect={onSelect}>
        <Slab x={26} y={20} w={W - 52} d={78} h={9} cls={r("laptop_battery")} />
        {[0, 1, 2].map((i) => (
          <Panel
            key={i}
            x={38 + i * 84}
            y={30}
            w={72}
            d={58}
            z={9.4}
            cls="fill-transparent stroke-grey-30 [stroke-width:0.7]"
          />
        ))}
        <IsoLabel x={W / 2} y={59} z={16}>
          Battery
        </IsoLabel>
      </Region>

      {/* ── Board along the back, carrying the processor and memory ─────── */}
      <g className="pointer-events-none">
        <Slab x={26} y={116} w={W - 52} d={72} h={3} cls="fill-grey-10/60 stroke-grey-40 [stroke-width:0.9]" />
      </g>

      {/* Cooling: fan and heat pipe, drawn because a laptop has them and a
          drawing without them looks like a diagram of nothing in particular.
          Not a slot — no Region, no pointer. */}
      <g className="pointer-events-none">
        <ellipse
          cx={iso(66, 152, 6)[0]}
          cy={iso(66, 152, 6)[1]}
          rx={30}
          ry={17}
          className="fill-white stroke-grey-40 [stroke-width:0.9]"
        />
        <ellipse
          cx={iso(66, 152, 6)[0]}
          cy={iso(66, 152, 6)[1]}
          rx={11}
          ry={6}
          className="fill-transparent stroke-grey-30 [stroke-width:0.7]"
        />
        <polyline
          points={poly([
            [96, 152, 7],
            [150, 152, 7],
            [150, 138, 7],
          ])}
          className="fill-none stroke-grey-40 [stroke-width:2.5] [stroke-linejoin:round]"
        />
      </g>

      {/* ── Processor, under the heat pipe ──────────────────────────────── */}
      <Region code="cpu" filled={is("cpu")} active={on("cpu")} onHover={onHover} onSelect={onSelect}>
        <Slab x={132} y={124} w={44} d={40} h={5} z={3} cls={r("cpu")} />
        <IsoLabel x={154} y={144} z={12}>
          CPU
        </IsoLabel>
      </Region>

      {/* ── Memory: two stacked modules ─────────────────────────────────── */}
      <Region code="memory" filled={is("memory")} active={on("memory")} onHover={onHover} onSelect={onSelect}>
        <Slab x={188} y={122} w={74} d={16} h={4} z={3} cls={r("memory")} />
        <Slab x={188} y={146} w={74} d={16} h={4} z={3} cls={r("memory")} />
        <IsoLabel x={225} y={130} z={16}>
          RAM
        </IsoLabel>
      </Region>

      {/* ── Storage: an M.2 stick ───────────────────────────────────────── */}
      <Region code="storage" filled={is("storage")} active={on("storage")} onHover={onHover} onSelect={onSelect}>
        <Slab x={48} y={168} w={78} d={16} h={4} z={3} cls={r("storage")} />
        <IsoLabel x={87} y={176} z={14}>
          SSD
        </IsoLabel>
      </Region>

      {/* ── Bottom cover, floating off ──────────────────────────────────── */}
      <g className="pointer-events-none">
        <Panel
          x={0}
          y={0}
          w={W}
          d={Dp}
          z={LIFT}
          cls="fill-white stroke-grey-40 [stroke-width:1]"
        />
        {/* vents */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Panel
            key={i}
            x={104 + i * 16}
            y={30}
            w={7}
            d={44}
            z={LIFT + 0.4}
            cls="fill-transparent stroke-grey-30 [stroke-width:0.7]"
          />
        ))}
        {/* feet */}
        {[
          [24, 22],
          [W - 34, 22],
          [24, Dp - 32],
          [W - 34, Dp - 32],
        ].map(([fx, fy], i) => (
          <ellipse
            key={i}
            cx={iso(fx, fy, LIFT)[0]}
            cy={iso(fx, fy, LIFT)[1]}
            rx={7}
            ry={4}
            className="fill-transparent stroke-grey-30 [stroke-width:0.7]"
          />
        ))}
        <IsoLabel x={W / 2} y={Dp - 46} z={LIFT + 6}>
          Bottom cover
        </IsoLabel>
      </g>

      {/* Guide lines showing where the cover drops on. Dotted and faint —
          they explain the explosion without competing with the parts. */}
      <g className="pointer-events-none">
        {[
          [0, 0],
          [W, 0],
          [W, Dp],
        ].map(([gx, gy], i) => {
          const [x1, y1] = iso(gx, gy, 0)
          const [x2, y2] = iso(gx, gy, LIFT)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className="stroke-grey-30 [stroke-width:0.7] [stroke-dasharray:2_4]"
            />
          )
        })}
      </g>
    </svg>
  )
}

const BuildDiagram = (props: Props) => (
  <div className="w-full">
    {props.buildType === "laptop" ? <Laptop {...props} /> : <Desktop {...props} />}
  </div>
)

export { NON_PHYSICAL, LABELS }
export default BuildDiagram

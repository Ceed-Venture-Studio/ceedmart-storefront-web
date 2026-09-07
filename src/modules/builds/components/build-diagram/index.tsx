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
      : "fill-transparent stroke-grey-40 [stroke-width:0.9] [stroke-dasharray:3_3]",
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

const Desktop = ({ filled, active, onHover, onSelect }: Props) => {
  const is = (c: string) => filled.has(c)
  const on = (c: string) => active === c
  const r = (c: string) => partClass(is(c), on(c))

  return (
    <svg
      viewBox="-6 -22 432 496"
      className="w-full h-auto"
      role="img"
      aria-label="Desktop PC build diagram"
    >
      {/* Case — the outline everything sits inside */}
      <Region code="case" filled={is("case")} active={on("case")} onHover={onHover} onSelect={onSelect}>
        <Box x={14} y={14} w={372} h={442} rx={14} cls={r("case")} depth={16} />
      </Region>

      {/* Motherboard */}
      <Region code="motherboard" filled={is("motherboard")} active={on("motherboard")} onHover={onHover} onSelect={onSelect}>
        <Box x={42} y={44} w={240} h={250} rx={6} cls={r("motherboard")} />
        <Caption x={214} y={60}>Motherboard</Caption>
      </Region>

      {/* Cooler sits on top of the CPU */}
      <Region code="cpu_cooler" filled={is("cpu_cooler")} active={on("cpu_cooler")} onHover={onHover} onSelect={onSelect}>
        <Box x={74} y={80} w={86} h={46} rx={5} cls={r("cpu_cooler")} />
        <circle cx="117" cy="103" r="15" className={r("cpu_cooler")} />
        <Caption x={117} y={74}>Cooler</Caption>
        <Tick x={152} y={88} show={is("cpu_cooler")} />
      </Region>

      {/* CPU socket, beneath the cooler */}
      <Region code="cpu" filled={is("cpu")} active={on("cpu")} onHover={onHover} onSelect={onSelect}>
        <Box x={86} y={134} w={62} h={58} rx={4} cls={r("cpu")} />
        <Caption x={117} y={168}>CPU</Caption>
        <Tick x={142} y={140} show={is("cpu")} />
      </Region>

      {/* Memory — four slots to the right of the socket */}
      <Region code="memory" filled={is("memory")} active={on("memory")} onHover={onHover} onSelect={onSelect}>
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            x={176 + i * 15}
            y={80}
            w={9}
            h={112}
            rx={2}
            cls={r("memory")}
            depth={4}
          />
        ))}
        <Caption x={205} y={208}>RAM</Caption>
        <Tick x={244} y={88} show={is("memory")} />
      </Region>

      {/* Storage — M.2 on the board */}
      <Region code="storage" filled={is("storage")} active={on("storage")} onHover={onHover} onSelect={onSelect}>
        <Box x={74} y={214} w={150} h={18} rx={3} cls={r("storage")} />
        <Caption x={149} y={250}>Storage</Caption>
        <Tick x={216} y={216} show={is("storage")} />
      </Region>

      {/* Graphics card — hangs off the board's lower slots and out to the right */}
      <Region code="gpu" filled={is("gpu")} active={on("gpu")} onHover={onHover} onSelect={onSelect}>
        <Box x={52} y={300} w={300} h={56} rx={5} cls={r("gpu")} />
        <circle cx="140" cy="328" r="18" className={r("gpu")} />
        <circle cx="196" cy="328" r="18" className={r("gpu")} />
        <Caption x={280} y={332}>Graphics card</Caption>
        <Tick x={340} y={308} show={is("gpu")} />
      </Region>

      {/* Power supply — shrouded along the bottom */}
      <Region code="psu" filled={is("psu")} active={on("psu")} onHover={onHover} onSelect={onSelect}>
        <Box x={42} y={384} w={196} h={58} rx={5} cls={r("psu")} />
        <circle cx="88" cy="413" r="18" className={r("psu")} />
        <Caption x={170} y={418}>Power supply</Caption>
        <Tick x={226} y={392} show={is("psu")} />
      </Region>

      {/* Case fans — front intake stack */}
      <Region code="case_cooling" filled={is("case_cooling")} active={on("case_cooling")} onHover={onHover} onSelect={onSelect}>
        {[110, 190, 270].map((cy) => (
          <circle key={cy} cx="330" cy={cy} r="26" className={r("case_cooling")} />
        ))}
        <Caption x={330} y={72}>Fans</Caption>
        <Tick x={352} y={84} show={is("case_cooling")} />
      </Region>
    </svg>
  )
}

// ─── Laptop ───────────────────────────────────────────────────────────────

const Laptop = ({ filled, active, onHover, onSelect }: Props) => {
  const is = (c: string) => filled.has(c)
  const on = (c: string) => active === c
  const r = (c: string) => partClass(is(c), on(c))

  // Internals sit in a strip along the top of the base, where they
  // physically live. Labels go INSIDE each part rather than floating above:
  // above the strip is the hinge line, and a caption there collides with
  // the chassis outline at every width.
  // cpu and memory, not laptop_cpu and laptop_memory. The laptop now shares
  // the desktop's processor, memory and storage slots — the laptop-specific
  // ones are retired, so pointing at them here drew four parts that could
  // never light up and did nothing when clicked.
  const internals: [string, number, number][] = [
    ["cpu", 76, 62],
    ["memory", 146, 58],
    ["storage", 212, 58],
    ["laptop_battery", 278, 62],
  ]
  const INTERNAL_LABEL: Record<string, string> = {
    cpu: "CPU",
    memory: "RAM",
    storage: "SSD",
    laptop_battery: "Battery",
  }

  return (
    <svg
      viewBox="-6 -14 424 360"
      className="w-full h-auto"
      role="img"
      aria-label="Laptop build diagram"
    >
      {/* Chassis — lid and base together are the model */}
      <Region code="laptop_model" filled={is("laptop_model")} active={on("laptop_model")} onHover={onHover} onSelect={onSelect}>
        <Box x={52} y={10} w={296} h={182} rx={10} cls={r("laptop_model")} />
        <path d="M 20 318 L 58 196 L 342 196 L 380 318 Z" className={r("laptop_model")} />
        <Tick x={338} y={22} show={is("laptop_model")} />
      </Region>

      {/* Screen — inset in the lid */}
      <Region code="laptop_display" filled={is("laptop_display")} active={on("laptop_display")} onHover={onHover} onSelect={onSelect}>
        <Box x={68} y={24} w={264} h={154} rx={4} cls={r("laptop_display")} />
        <Caption x={200} y={106}>Screen</Caption>
        <Tick x={320} y={36} show={is("laptop_display")} />
      </Region>

      {/* Internals, along the top of the base */}
      {internals.map(([code, x, w]) => (
        <Region key={code} code={code} filled={is(code)} active={on(code)} onHover={onHover} onSelect={onSelect}>
          <Box x={x} y={204} w={w} h={22} rx={3} cls={r(code)} depth={5} />
          <text
            x={x + w / 2}
            y="219"
            textAnchor="middle"
            className="fill-ui-fg-muted [font-size:10px] pointer-events-none select-none"
          >
            {INTERNAL_LABEL[code]}
          </text>
          <Tick x={x + w - 4} y={204} show={is(code)} />
        </Region>
      ))}

      {/* Keyboard deck */}
      <Region code="laptop_keyboard" filled={is("laptop_keyboard")} active={on("laptop_keyboard")} onHover={onHover} onSelect={onSelect}>
        <Box x={84} y={238} w={232} h={40} rx={4} cls={r("laptop_keyboard")} />
        {[0, 1, 2].map((row) =>
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={92 + col * 22}
              y={244 + row * 11}
              width="16"
              height="7"
              rx="1.5"
              className={
                is("laptop_keyboard")
                  ? "fill-ceedmart-navy/25 stroke-none"
                  : "fill-grey-20 stroke-none"
              }
            />
          ))
        )}
        <Tick x={306} y={246} show={is("laptop_keyboard")} />
      </Region>

      {/* Trackpad — decoration, not a slot */}
      <rect
        x="172"
        y="286"
        width="56"
        height="18"
        rx="3"
        className="fill-transparent stroke-grey-30 [stroke-width:1]"
      />
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

export type PropertyType = "residence" | "office"

export type AppliancePreset = {
  id: string
  name: string
  category: string
  // typical watts when running. inverter_watts is the lower draw of an
  // inverter/variable-speed model where applicable.
  watts: number
  inverter_watts?: number
  // appliances driven by compressors / large motors that benefit from
  // inverter (variable-speed) tech. when true, the form shows the toggle.
  inverter_capable?: boolean
  default_hours: number
  default_period: "day" | "night" | "both"
  property_types: PropertyType[]
  // hint to backend surge calc; spec auto-detects from name, but we set
  // explicitly when we know it's a heavy motor.
  heavy_motor?: boolean
}

const RES = "residence" as const
const OFF = "office" as const

export const APPLIANCE_PRESETS: AppliancePreset[] = [
  // ── Lighting ────────────────────────────────────────────
  { id: "led-bulb", name: "LED Bulb", category: "Lighting", watts: 10, default_hours: 6, default_period: "night", property_types: [RES, OFF] },
  { id: "led-tube", name: "LED Tube Light", category: "Lighting", watts: 20, default_hours: 8, default_period: "both", property_types: [RES, OFF] },
  { id: "cfl-bulb", name: "CFL / Energy-saver Bulb", category: "Lighting", watts: 20, default_hours: 6, default_period: "night", property_types: [RES, OFF] },
  { id: "incandescent-bulb", name: "Incandescent Bulb", category: "Lighting", watts: 60, default_hours: 4, default_period: "night", property_types: [RES] },
  { id: "led-panel", name: "LED Panel / Office Light", category: "Lighting", watts: 40, default_hours: 9, default_period: "day", property_types: [OFF] },
  { id: "fluorescent-fixture", name: "Fluorescent Fixture", category: "Lighting", watts: 36, default_hours: 9, default_period: "day", property_types: [OFF] },
  { id: "outdoor-floodlight", name: "Outdoor Floodlight", category: "Lighting", watts: 50, default_hours: 12, default_period: "night", property_types: [RES, OFF] },
  { id: "security-light", name: "Security Light", category: "Lighting", watts: 30, default_hours: 12, default_period: "night", property_types: [RES, OFF] },

  // ── Fans ────────────────────────────────────────────────
  { id: "ceiling-fan", name: "Ceiling Fan", category: "Fans", watts: 60, default_hours: 8, default_period: "both", property_types: [RES, OFF] },
  { id: "standing-fan", name: "Standing Fan", category: "Fans", watts: 60, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "table-fan", name: "Table / Wall Fan", category: "Fans", watts: 40, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "rechargeable-fan", name: "Rechargeable Fan (charging)", category: "Fans", watts: 30, default_hours: 4, default_period: "day", property_types: [RES] },
  { id: "exhaust-fan", name: "Exhaust Fan", category: "Fans", watts: 50, default_hours: 4, default_period: "day", property_types: [RES, OFF] },
  { id: "air-cooler", name: "Air Cooler", category: "Fans", watts: 200, default_hours: 6, default_period: "both", property_types: [RES, OFF] },

  // ── Air Conditioning (inverter-capable) ─────────────────
  { id: "ac-1hp", name: "Air Conditioner — 1 HP", category: "Air Conditioning", watts: 1000, inverter_watts: 750, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "ac-1.5hp", name: "Air Conditioner — 1.5 HP", category: "Air Conditioning", watts: 1500, inverter_watts: 1100, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "ac-2hp", name: "Air Conditioner — 2 HP", category: "Air Conditioning", watts: 2000, inverter_watts: 1500, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "ac-2.5hp", name: "Air Conditioner — 2.5 HP", category: "Air Conditioning", watts: 2500, inverter_watts: 1900, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "ac-3hp", name: "Air Conditioner — 3 HP", category: "Air Conditioning", watts: 3000, inverter_watts: 2200, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "both", property_types: [RES, OFF] },
  { id: "ac-5hp", name: "Air Conditioner — 5 HP / Cassette", category: "Air Conditioning", watts: 5000, inverter_watts: 3800, inverter_capable: true, heavy_motor: true, default_hours: 8, default_period: "day", property_types: [OFF] },

  // ── Refrigeration (inverter-capable, heavy) ─────────────
  { id: "fridge-single", name: "Refrigerator — Single Door", category: "Refrigeration", watts: 150, inverter_watts: 100, inverter_capable: true, heavy_motor: true, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "fridge-double", name: "Refrigerator — Double Door", category: "Refrigeration", watts: 250, inverter_watts: 150, inverter_capable: true, heavy_motor: true, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "fridge-side", name: "Refrigerator — Side-by-Side", category: "Refrigeration", watts: 350, inverter_watts: 200, inverter_capable: true, heavy_motor: true, default_hours: 24, default_period: "both", property_types: [RES] },
  { id: "chest-freezer", name: "Chest Freezer", category: "Refrigeration", watts: 350, inverter_watts: 200, inverter_capable: true, heavy_motor: true, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "upright-freezer", name: "Upright Freezer", category: "Refrigeration", watts: 400, inverter_watts: 250, inverter_capable: true, heavy_motor: true, default_hours: 24, default_period: "both", property_types: [RES] },
  { id: "wine-cooler", name: "Wine Cooler", category: "Refrigeration", watts: 100, inverter_watts: 70, inverter_capable: true, default_hours: 24, default_period: "both", property_types: [RES] },
  { id: "ice-maker", name: "Ice Maker", category: "Refrigeration", watts: 200, inverter_capable: true, heavy_motor: true, default_hours: 6, default_period: "day", property_types: [RES, OFF] },

  // ── Kitchen ─────────────────────────────────────────────
  { id: "microwave", name: "Microwave Oven", category: "Kitchen", watts: 1000, default_hours: 0.5, default_period: "day", property_types: [RES, OFF] },
  { id: "electric-kettle", name: "Electric Kettle", category: "Kitchen", watts: 2000, default_hours: 0.3, default_period: "day", property_types: [RES, OFF] },
  { id: "toaster", name: "Toaster", category: "Kitchen", watts: 800, default_hours: 0.2, default_period: "day", property_types: [RES, OFF] },
  { id: "blender", name: "Blender", category: "Kitchen", watts: 400, default_hours: 0.2, default_period: "day", property_types: [RES] },
  { id: "food-processor", name: "Food Processor", category: "Kitchen", watts: 600, default_hours: 0.2, default_period: "day", property_types: [RES] },
  { id: "yam-pounder", name: "Yam Pounder", category: "Kitchen", watts: 800, default_hours: 0.2, default_period: "day", property_types: [RES] },
  { id: "rice-cooker", name: "Rice Cooker", category: "Kitchen", watts: 700, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "pressure-cooker", name: "Electric Pressure Cooker", category: "Kitchen", watts: 1000, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "air-fryer", name: "Air Fryer", category: "Kitchen", watts: 1500, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "electric-oven", name: "Electric Oven", category: "Kitchen", watts: 2000, default_hours: 1, default_period: "day", property_types: [RES] },
  { id: "induction-cooker", name: "Induction Cooker", category: "Kitchen", watts: 1800, default_hours: 1.5, default_period: "day", property_types: [RES] },
  { id: "electric-cooker", name: "Electric Cooker (4-burner)", category: "Kitchen", watts: 8000, default_hours: 1.5, default_period: "day", property_types: [RES] },
  { id: "coffee-maker", name: "Coffee Maker", category: "Kitchen", watts: 800, default_hours: 0.5, default_period: "day", property_types: [RES, OFF] },
  { id: "espresso-machine", name: "Espresso Machine", category: "Kitchen", watts: 1500, default_hours: 0.5, default_period: "day", property_types: [OFF] },
  { id: "water-dispenser", name: "Water Dispenser (Hot/Cold)", category: "Kitchen", watts: 600, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "dishwasher", name: "Dishwasher", category: "Kitchen", watts: 1800, default_hours: 1, default_period: "day", property_types: [RES] },
  { id: "stand-mixer", name: "Stand Mixer", category: "Kitchen", watts: 300, default_hours: 0.2, default_period: "day", property_types: [RES] },

  // ── Entertainment ───────────────────────────────────────
  { id: "tv-32", name: "TV — 32\"", category: "Entertainment", watts: 50, default_hours: 5, default_period: "both", property_types: [RES, OFF] },
  { id: "tv-43", name: "TV — 43\"", category: "Entertainment", watts: 80, default_hours: 5, default_period: "both", property_types: [RES, OFF] },
  { id: "tv-50", name: "TV — 50\"", category: "Entertainment", watts: 100, default_hours: 5, default_period: "both", property_types: [RES, OFF] },
  { id: "tv-55", name: "TV — 55\"", category: "Entertainment", watts: 120, default_hours: 5, default_period: "both", property_types: [RES] },
  { id: "tv-65", name: "TV — 65\"", category: "Entertainment", watts: 150, default_hours: 5, default_period: "both", property_types: [RES] },
  { id: "tv-75", name: "TV — 75\"", category: "Entertainment", watts: 220, default_hours: 5, default_period: "both", property_types: [RES] },
  { id: "decoder", name: "Decoder (DStv / GOtv)", category: "Entertainment", watts: 25, default_hours: 5, default_period: "both", property_types: [RES, OFF] },
  { id: "soundbar", name: "Soundbar", category: "Entertainment", watts: 60, default_hours: 4, default_period: "night", property_types: [RES] },
  { id: "home-theatre", name: "Home Theatre System", category: "Entertainment", watts: 200, default_hours: 3, default_period: "night", property_types: [RES] },
  { id: "game-console", name: "Game Console (PS / Xbox)", category: "Entertainment", watts: 200, default_hours: 3, default_period: "night", property_types: [RES] },
  { id: "projector", name: "Projector", category: "Entertainment", watts: 250, default_hours: 2, default_period: "day", property_types: [RES, OFF] },

  // ── Computing & Office ──────────────────────────────────
  { id: "laptop", name: "Laptop", category: "Computing", watts: 65, default_hours: 8, default_period: "both", property_types: [RES, OFF] },
  { id: "desktop-pc", name: "Desktop PC", category: "Computing", watts: 250, default_hours: 8, default_period: "day", property_types: [RES, OFF] },
  { id: "all-in-one-pc", name: "All-in-One PC", category: "Computing", watts: 150, default_hours: 8, default_period: "day", property_types: [OFF] },
  { id: "monitor-22", name: "Monitor — 22\"", category: "Computing", watts: 25, default_hours: 8, default_period: "day", property_types: [OFF] },
  { id: "monitor-27", name: "Monitor — 27\"", category: "Computing", watts: 35, default_hours: 8, default_period: "day", property_types: [OFF] },
  { id: "wifi-router", name: "Wi-Fi Router", category: "Computing", watts: 15, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "modem", name: "Modem / ONT", category: "Computing", watts: 10, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "network-switch", name: "Network Switch", category: "Computing", watts: 30, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "small-server", name: "Server (small)", category: "Computing", watts: 350, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "ups", name: "UPS (idle draw)", category: "Computing", watts: 50, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "printer-inkjet", name: "Printer — Inkjet", category: "Computing", watts: 50, default_hours: 0.5, default_period: "day", property_types: [RES, OFF] },
  { id: "printer-laser", name: "Printer — Laser", category: "Computing", watts: 500, default_hours: 0.5, default_period: "day", property_types: [OFF] },
  { id: "photocopier", name: "Photocopier", category: "Computing", watts: 1500, default_hours: 1, default_period: "day", property_types: [OFF] },
  { id: "scanner", name: "Scanner", category: "Computing", watts: 50, default_hours: 0.5, default_period: "day", property_types: [OFF] },
  { id: "shredder", name: "Paper Shredder", category: "Computing", watts: 250, default_hours: 0.2, default_period: "day", property_types: [OFF] },
  { id: "phone-charger", name: "Phone Charger", category: "Computing", watts: 10, default_hours: 3, default_period: "night", property_types: [RES, OFF] },
  { id: "tablet-charger", name: "Tablet Charger", category: "Computing", watts: 15, default_hours: 3, default_period: "night", property_types: [RES, OFF] },
  { id: "desk-phone", name: "Desk Phone", category: "Computing", watts: 5, default_hours: 9, default_period: "day", property_types: [OFF] },
  { id: "video-conf", name: "Video Conference System", category: "Computing", watts: 200, default_hours: 4, default_period: "day", property_types: [OFF] },
  { id: "conf-tv", name: "Conference Room TV — 65\"", category: "Computing", watts: 150, default_hours: 4, default_period: "day", property_types: [OFF] },

  // ── Personal Care ───────────────────────────────────────
  { id: "iron", name: "Clothes Iron", category: "Personal Care", watts: 1200, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "steam-iron", name: "Steam Iron", category: "Personal Care", watts: 1500, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "hair-dryer", name: "Hair Dryer", category: "Personal Care", watts: 1500, default_hours: 0.2, default_period: "day", property_types: [RES] },
  { id: "hair-clipper", name: "Hair Clipper", category: "Personal Care", watts: 15, default_hours: 0.3, default_period: "day", property_types: [RES] },
  { id: "electric-shaver", name: "Electric Shaver", category: "Personal Care", watts: 15, default_hours: 0.2, default_period: "day", property_types: [RES] },
  { id: "sewing-machine", name: "Sewing Machine", category: "Personal Care", watts: 100, default_hours: 1, default_period: "day", property_types: [RES] },

  // ── Laundry ─────────────────────────────────────────────
  { id: "washing-machine", name: "Washing Machine — Top Load", category: "Laundry", watts: 500, inverter_watts: 350, inverter_capable: true, heavy_motor: true, default_hours: 1, default_period: "day", property_types: [RES] },
  { id: "washing-machine-front", name: "Washing Machine — Front Load (with heater)", category: "Laundry", watts: 2000, inverter_watts: 1500, inverter_capable: true, heavy_motor: true, default_hours: 1, default_period: "day", property_types: [RES] },
  { id: "tumble-dryer", name: "Tumble Dryer", category: "Laundry", watts: 3000, default_hours: 1, default_period: "day", property_types: [RES] },
  { id: "vacuum-cleaner", name: "Vacuum Cleaner", category: "Laundry", watts: 1000, default_hours: 0.3, default_period: "day", property_types: [RES, OFF] },
  { id: "steam-mop", name: "Steam Mop", category: "Laundry", watts: 1500, default_hours: 0.5, default_period: "day", property_types: [RES] },

  // ── Water & Pumps (heavy motors) ────────────────────────
  { id: "water-pump-0.5hp", name: "Water Pump — 0.5 HP", category: "Water", watts: 370, heavy_motor: true, default_hours: 1, default_period: "day", property_types: [RES, OFF] },
  { id: "water-pump-1hp", name: "Water Pump — 1 HP", category: "Water", watts: 750, heavy_motor: true, default_hours: 1, default_period: "day", property_types: [RES, OFF] },
  { id: "borehole-pump", name: "Submersible Borehole Pump", category: "Water", watts: 1500, heavy_motor: true, default_hours: 1, default_period: "day", property_types: [RES, OFF] },
  { id: "water-heater-instant", name: "Water Heater — Instant", category: "Water", watts: 3000, default_hours: 0.3, default_period: "day", property_types: [RES] },
  { id: "water-heater-storage", name: "Water Heater — Storage Tank", category: "Water", watts: 1500, default_hours: 1, default_period: "day", property_types: [RES] },

  // ── Security & Misc ─────────────────────────────────────
  { id: "cctv-system", name: "CCTV System (4-cam + DVR)", category: "Security", watts: 30, default_hours: 24, default_period: "both", property_types: [RES, OFF] },
  { id: "cctv-large", name: "CCTV System (8-cam + NVR)", category: "Security", watts: 80, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "doorbell", name: "Smart Doorbell", category: "Security", watts: 5, default_hours: 24, default_period: "both", property_types: [RES] },
  { id: "electric-fence", name: "Electric Fence", category: "Security", watts: 30, default_hours: 12, default_period: "night", property_types: [RES, OFF] },
  { id: "access-control", name: "Access Control / Time-attendance", category: "Security", watts: 20, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "alarm-system", name: "Alarm System", category: "Security", watts: 20, default_hours: 24, default_period: "both", property_types: [RES, OFF] },

  // ── Misc ────────────────────────────────────────────────
  { id: "aquarium-pump", name: "Aquarium Pump", category: "Misc", watts: 30, default_hours: 24, default_period: "both", property_types: [RES] },
  { id: "vending-machine", name: "Vending Machine", category: "Misc", watts: 200, inverter_capable: true, default_hours: 24, default_period: "both", property_types: [OFF] },
  { id: "air-purifier", name: "Air Purifier", category: "Misc", watts: 50, default_hours: 12, default_period: "both", property_types: [RES, OFF] },
  { id: "humidifier", name: "Humidifier", category: "Misc", watts: 30, default_hours: 8, default_period: "night", property_types: [RES] },
  { id: "treadmill", name: "Treadmill", category: "Misc", watts: 1500, default_hours: 0.5, default_period: "day", property_types: [RES] },
  { id: "massage-chair", name: "Massage Chair", category: "Misc", watts: 200, default_hours: 0.5, default_period: "night", property_types: [RES] },
]

export const getPresetsForProperty = (property: PropertyType) =>
  APPLIANCE_PRESETS.filter((p) => p.property_types.includes(property))

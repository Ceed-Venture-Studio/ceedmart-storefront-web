import { clx } from "@medusajs/ui"

import type { FulfilmentGroup } from "@lib/util/fulfilment-groups"

// Fulfilment-group header for a mixed cart (BRD §9.2, D-04).
//
// One checkout, two delivery promises. §6.4 requires that locally stocked
// items must not inherit the pre-order timeline — so each group states its
// own, and the pre-order group is visually distinct rather than just
// labelled. A shopper skimming a cart should not have to read carefully to
// notice that half of it is being flown in.

type Props = {
  group: FulfilmentGroup
  /** Index within the cart, for the "1 of 2" wayfinder on mixed carts. */
  position?: number
  total?: number
}

const FulfilmentGroupHeader = ({ group, position, total }: Props) => {
  const isPreorder = group.kind === "preorder"

  return (
    <div
      className={clx(
        "flex flex-col gap-1 px-4 py-3 rounded-t-lg border-b",
        isPreorder
          ? "bg-ceedmart-navy/5 border-ceedmart-navy/20"
          : "bg-grey-5 border-grey-20"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={clx(
              "inline-block h-2 w-2 rounded-full",
              isPreorder ? "bg-ceedmart-navy" : "bg-wholefoods"
            )}
            aria-hidden="true"
          />
          <span className="txt-medium-plus text-ui-fg-base">{group.title}</span>
          <span className="txt-small text-ui-fg-muted">
            {group.items.length} item{group.items.length === 1 ? "" : "s"}
          </span>
        </div>

        {total && total > 1 && position && (
          <span className="txt-small text-ui-fg-muted whitespace-nowrap">
            Delivery {position} of {total}
          </span>
        )}
      </div>

      <span
        className={clx(
          "txt-small",
          isPreorder ? "text-ceedmart-navy font-medium" : "text-ui-fg-subtle"
        )}
      >
        {group.timeline}
      </span>
    </div>
  )
}

export default FulfilmentGroupHeader

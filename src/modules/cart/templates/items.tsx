import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import { groupCartByFulfilment } from "@lib/data/preorder"
import type { FulfilmentGroup } from "@lib/util/fulfilment-groups"
import Item from "@modules/cart/components/item"
import FulfilmentGroupHeader from "@modules/cart/components/fulfilment-groups"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const byNewest = (items: HttpTypes.StoreCartLineItem[]) =>
  [...items].sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1))

// Cart line items, split into fulfilment groups (BRD §9.2, D-04).
//
// A cart mixing local stock with US pre-orders has two delivery promises,
// and §6.4 forbids local items inheriting the pre-order timeline. So when
// both kinds are present each gets its own headed section stating its own
// timeline. A cart of one kind renders exactly as it always did — no
// gratuitous section header around a single group.
const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  if (!items) {
    return (
      <div>
        <div className="pb-3 flex items-center">
          <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
        </div>
        <div className="small:hidden">
          {repeat(5).map((i) => (
            <SkeletonLineItem key={i} />
          ))}
        </div>
        <div className="hidden small:block">
          <Table>
            <Table.Body>
              {repeat(5).map((i) => (
                <SkeletonLineItem key={i} />
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }

  const grouped = await groupCartByFulfilment(cart)

  // Single-group carts keep the original flat layout.
  const sections: FulfilmentGroup[] = grouped.isMixed
    ? grouped.groups
    : [
        {
          kind: "standard",
          title: "",
          timeline: "",
          items: items as HttpTypes.StoreCartLineItem[],
          estimateDays: null,
        },
      ]

  return (
    <div>
      <div className="pb-3 flex items-center">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>

      {grouped.isMixed && (
        <p className="txt-small text-ui-fg-subtle pb-4">
          Your order will arrive in {grouped.groups.length} deliveries — the
          items below ship on different timelines.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {sections.map((group, index) => {
          const sorted = byNewest(group.items)

          return (
            <div
              key={group.kind}
              className={
                grouped.isMixed
                  ? "border border-grey-20 rounded-lg overflow-hidden"
                  : ""
              }
            >
              {grouped.isMixed && (
                <FulfilmentGroupHeader
                  group={group}
                  position={index + 1}
                  total={sections.length}
                />
              )}

              {/* Mobile list */}
              <div
                className={
                  grouped.isMixed ? "small:hidden px-3" : "small:hidden"
                }
              >
                {sorted.map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    layout="mobile"
                    currencyCode={cart?.currency_code}
                  />
                ))}
              </div>

              {/* Desktop table */}
              <div
                className={
                  grouped.isMixed
                    ? "hidden small:block px-3"
                    : "hidden small:block"
                }
              >
                <Table>
                  {/* Column headings belong once per table, and a grouped
                      cart repeats the table per section — so they are shown
                      only on the first. */}
                  {index === 0 && (
                    <Table.Header className="border-t-0">
                      <Table.Row className="text-ui-fg-subtle txt-medium-plus">
                        <Table.HeaderCell className="!pl-0">
                          Item
                        </Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell className="hidden small:table-cell">
                          Price
                        </Table.HeaderCell>
                        <Table.HeaderCell className="!pr-0 text-right">
                          Total
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                  )}
                  <Table.Body>
                    {sorted.map((item) => (
                      <Item
                        key={item.id}
                        item={item}
                        layout="desktop"
                        currencyCode={cart?.currency_code}
                      />
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ItemsTemplate

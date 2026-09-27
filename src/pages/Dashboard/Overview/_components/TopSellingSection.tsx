
import React from "react";
import AnimatedContainer from "@/common/AnimatedContainer";
import { ItemsTable, ItemsTableRow } from "@/common/ItemsTable";

const topSellingRows: ItemsTableRow[] = [
  { id: 1, name: "A4Ttech Mouse",  image: "/Product/Mouse Item Image.png",    qty: 40 },
  { id: 2, name: "HP Monitor",     image: "/Product/Monitor Item Image.png",  qty: 20 },
  { id: 3, name: "A4Ttech Mouse",  image: "/Product/Mouse Item Image.png",    qty: 14 },
  { id: 4, name: "HP Monitor",     image: "/Product/Monitor Item Image.png",  qty: 10 },
];

const lowStockRows: ItemsTableRow[] = [
  { id: 1, name: "HP Monitor",     image: "/Product/Monitor Item Image.png",  qty: 40 },
  { id: 2, name: "A4Ttech Mouse",  image: "/Product/Mouse Item Image.png",    qty: 20 },
  { id: 3, name: "HP Monitor",     image: "/Product/Monitor Item Image.png",  qty: 14 },
  { id: 4, name: "A4Ttech Mouse",  image: "/Product/Mouse Item Image.png",    qty: 10 },
];

export function TopSellingSection() {
  return (
    <AnimatedContainer delay={0.3}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItemsTable title="Top Selling Items" rows={topSellingRows} />
        <ItemsTable title="Low Stock Items"   rows={lowStockRows}   />
      </div>
    </AnimatedContainer>
  );
}

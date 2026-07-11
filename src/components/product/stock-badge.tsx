import { Badge } from '@/components/ui/badge';

/**
 * Stock signalling with three states: out of stock, low (urgency), and in
 * stock. "Low" doubles as social proof / scarcity, matching the original
 * ShopKenya behaviour without being dishonest — it reflects the real count.
 */
const LOW_STOCK_THRESHOLD = 10;

export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return <Badge variant="outline">Out of stock</Badge>;
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <Badge variant="warning">Only {stock} left</Badge>;
  }
  return <Badge variant="success">In stock</Badge>;
}

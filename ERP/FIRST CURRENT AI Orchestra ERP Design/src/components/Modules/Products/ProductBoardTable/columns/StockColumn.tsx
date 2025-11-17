interface StockColumnProps {
  value: number;
}

export function StockColumn({ value }: StockColumnProps) {
  return (
    <div className="text-right">
      <span className="text-sm">{value}</span>
    </div>
  );
}

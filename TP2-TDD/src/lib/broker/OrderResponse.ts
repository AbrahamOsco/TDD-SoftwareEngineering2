export type OrderResponse = {
  symbol: string;
  side: string;
  type: string;
  transactTime: Date;
  quantity: number;
  price: number;
  commissionAsset: string;
};

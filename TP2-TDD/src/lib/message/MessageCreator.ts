import { OrderResponse } from "../broker";

export class MessageCreator {

    private constructor() {};

    public static createPurchaseMessage(response: OrderResponse): string {
        const commissionAssetLength = response.commissionAsset.length;
        const symbol1 = response.symbol.substring(0, commissionAssetLength);
        const symbol2 = response.symbol.substring(commissionAssetLength);
        return `We purchased 💰  ${response.quantity} ${symbol1} and paid ${response.price * response.quantity} ${symbol2}\n${new Date(response.transactTime)}`;
    }

    public static createSaleMessage(response: OrderResponse): string {
        const commissionAssetLength = response.commissionAsset.length;
        const symbol1 = response.symbol.slice(0, -commissionAssetLength);
        const symbol2 = response.symbol.slice(-commissionAssetLength);
        return `We sold 🤑  ${response.quantity} ${symbol1} and received ${response.price * response.quantity} ${symbol2}\n${new Date(response.transactTime)}`;
    }
}
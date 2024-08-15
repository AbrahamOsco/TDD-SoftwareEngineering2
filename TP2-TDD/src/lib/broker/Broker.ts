import { OrderResponse } from "./OrderResponse";
import { BalanceResponse } from "./BalanceResponse";
import { Notifier } from "../notifier";
import { Log } from "../logger/Log";
import { MessageCreator } from "../message";
import { config } from 'dotenv';
config();

const { Spot } = require("@binance/connector");

export class Broker {
    private static instance: Broker;

    private readonly client = new Spot(process.env.API_KEY, process.env.SECRET_KEY, {
        baseURL: "https://testnet.binance.vision",
       }
    );

    private readonly notifier = new Notifier(process.env.DISCORD_WEBHOOK);

    private constructor() {}

    public static getInstance(): Broker {
        if (!Broker.instance) {
            Broker.instance = new Broker();
        }
        return Broker.instance;
    }

    public async buy(symbol: string, quantity: number): Promise<OrderResponse> {
        const result = await this.newOrder(symbol, "BUY", quantity);
        if (result) {
            const message = MessageCreator.createPurchaseMessage(result);
            Log.info("[Broker]: " + message);
            this.notifier.sendNotification(message);
        }
        return result;
    }

    public async sell(symbol: string, quantity: number): Promise<OrderResponse> {
        const result = await this.newOrder(symbol, "SELL", quantity); 
        if (result) {
            const message = MessageCreator.createSaleMessage(result);
            Log.info("[Broker]: " + message);
            this.notifier.sendNotification(message);
        }
        return result;
    }
    
    public async getBalance(asset: string): Promise<BalanceResponse> {
        let response;
        try {
            response = await this.client.account();
        } catch (e) {
            throw new Error(
                `There was a Problem communicating with the Binance API ❌: ${e.response.data.msg}`
            );
        }
        const balances = response.data.balances;
        const balance = balances.find((balance: { asset: string }) => balance.asset === asset.toUpperCase());
        if (!balance) {
            throw new Error(
                `Trying to fetch balance of a nonexistent cryptocurrency ❌: ${asset}`
            );
        }
        const BalanceResponse = { asset: balance.asset, available: Number(balance.free)};
        Log.info(`[Broker]: We have 🪙  ${BalanceResponse.available} ${BalanceResponse.asset} available`);
        return BalanceResponse;
    }

    private async newOrder(symbol: string, side: string, quantity: number): Promise<OrderResponse> {
        try {
            const response = await this.client.newOrder(symbol, side, "MARKET", { quantity: quantity });
            const data = response.data;
            return {
                symbol: symbol,
                side: side,
                type: data.type,
                transactTime: data.transactTime,
                quantity: quantity,
                price: Number(data.fills[0].price),
                commissionAsset: data.fills[0].commissionAsset,
            };
    
        } catch (e) {
            const data = e.response.data;
            Log.error(`[Broker]: Attempted to ${side} ${quantity} ${symbol} ❌`);
            throw new Error(`${data.msg} ❌`);
        }
    }
}

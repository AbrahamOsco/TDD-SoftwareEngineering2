import { PriceData } from "../models/PriceData";
import {
  HISTORY_INTERVAL,
  SIGNIFICANT_CHANGE_THRESHOLD,
} from "../config/constants";
import { BinanceService } from "./BinanceService";
import { Log } from "../../logger/Log";

export interface Observer {
  update(): Promise<void>;
}

export class DataService {
  private static instance: DataService;
  private priceHistory: Map<string, PriceData[]> = new Map();
  private observers: Observer[] = [];
  private lastPrice: Map<string, number> = new Map();
  private binanceService: BinanceService | null = null;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  public setBinanceService(binanceService: BinanceService) {
    this.binanceService = binanceService;
  }

  public addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  public removeObserver(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  private async notifyObservers() {
    for (const observer of this.observers) {
      try {
        await observer.update();
      } catch (error) {
        Log.error("Observer update failed" + error);
        if (this.binanceService) {
          this.binanceService.close();
        }
        throw error;
      }
    }
  }

  public addPriceData(priceData: PriceData) {
    const { symbol, price, timestamp } = priceData;
    const lastPrice = this.lastPrice.get(symbol);
    const significantChange =
      lastPrice !== undefined &&
      Math.abs(price - lastPrice) / lastPrice >= SIGNIFICANT_CHANGE_THRESHOLD;

    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }

    if (lastPrice === undefined || significantChange) {
      const history = this.priceHistory.get(symbol)!;
      history.push({ symbol, price, timestamp });
      this.cleanOldData(symbol);
      this.lastPrice.set(symbol, price); // Actualizamos el último precio solo si es significativo
      if (significantChange) {
        Log.info(`New significant change for ${symbol}: ${price}`);
        this.notifyObservers();
      }
    }
  }

  private cleanOldData(symbol: string) {
    const history = this.priceHistory.get(symbol)!;
    const oneHourAgo = Date.now() - HISTORY_INTERVAL;
    this.priceHistory.set(
      symbol,
      history.filter((data) => data.timestamp >= oneHourAgo),
    );
  }

  public getPriceHistory(symbol: string): PriceData[] {
    return this.priceHistory.get(symbol) || [];
  }

  public getLastPrice(symbol: string): number | undefined {
    return this.lastPrice.get(symbol);
  }

  public getPricesInRange(
    symbol: string,
    from: number,
    until: number,
    defaultValue: number[],
  ): number[] {
    const now = Date.now();
    const startTime = now - from * 1000;
    const endTime = now - until * 1000;
    const history = this.getPriceHistory(symbol).filter(
      (data) => data.timestamp >= startTime && data.timestamp <= endTime,
    );
    return history.length ? history.map((data) => data.price) : defaultValue;
  }
}

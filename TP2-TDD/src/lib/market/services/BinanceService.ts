import WebSocket from "ws";
import { PriceData } from "../models/PriceData";
import { DataService } from "./DataService";
import { Log } from "../../logger/Log";

export class BinanceService {
  private ws: WebSocket | null = null;
  private dataService: DataService;

  constructor(dataService: DataService) {
    this.dataService = dataService;
    this.connect();
  }

  private connect(): void {
    const currencies = require("../config/currencies.json").currencies;
    const streamName = currencies
      .map((currency: string) => `${currency}@trade`)
      .join("/");
    this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`);

    this.ws.on("open", () => Log.info("WebSocket connected."));
    this.ws.on("message", (data) => this.handleMessage(data));
    this.ws.on("error", (error) => this.handleError(error));
    this.ws.on("close", () => this.handleClose());
  }

  private handleMessage(data: WebSocket.Data): void {
    const message = JSON.parse(data.toString());
    const priceData: PriceData = {
      symbol: message.s,
      price: parseFloat(message.p),
      timestamp: message.T,
    };
    this.dataService.addPriceData(priceData);
  }

  private handleError(error: Error): void {
    Log.error(`WebSocket error ${error}`);
  }

  private handleClose(): void {
    Log.info("WebSocket closed. Reconnecting...");
    setTimeout(() => this.connect(), 1000);
  }

  public close() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    Log.info("Resources cleaned up.");
    process.exit(1); // Terminate the program
  }
}

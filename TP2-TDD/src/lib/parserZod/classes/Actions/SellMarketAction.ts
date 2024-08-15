import { Broker } from "../../../broker/Broker";
import { Value } from "../Values/Value";
import { Action } from "./Action";

export class SellMarketAction implements Action {
    private symbol: string;
    private value: Value;

    public constructor(symbol: string, value: Value) {
      this.symbol = symbol;
      this.value = value;
    }

    public async apply(): Promise<void> {
        const anAmount =  await this.value.getAmount();
        const newSymbol = this.symbol.replace("/", "").toLowerCase();
        await Broker.getInstance().sell(newSymbol, anAmount);
    }

}

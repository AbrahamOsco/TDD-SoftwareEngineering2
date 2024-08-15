import { Broker } from "../../../broker";
import { Value } from "../Values/Value";
import { Action } from "./Action";

export class BuyMarketAction implements Action{
    private symbol: string;
    private amount: Value;
    
    public constructor(symbol: string, amount: Value){
        this.symbol = symbol;
        this.amount = amount;
    }
    
    public async apply(): Promise<void> {
        const anAmount = await this.amount.getAmount();
        const newSymbol = this.symbol.replace('/','').toLowerCase();
        await Broker.getInstance().buy(newSymbol, anAmount);
    }
    
}
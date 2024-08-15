import { Broker } from "../../../broker/Broker";
import { WalletCantEvaluatedError } from "../../exceptions/valueExceptions";
import { NumberValue } from "../BaseTypeValues/NumberValue";
import { Variables } from "../Variables/Variables";
import { Value } from "./Value";

export class WalletValue implements Value{
    private symbol: string;
    
    public constructor(symbol:string){
        this.symbol = symbol;
    }

    public async getValue() : Promise<number> {
        return (await Broker.getInstance().getBalance(this.symbol)).available;
    }

    public async evaluate(): Promise<boolean> {
        throw new WalletCantEvaluatedError("Wallet can't be evaluated");
    }
    
    public async setValueInVariables(variableName: string): Promise<void> {
        const balance = await Broker.getInstance().getBalance(this.symbol);
        Variables.getInstance().setVariable(variableName, new NumberValue(balance.available));
    }

    public async getAmount(): Promise<number> {
        const balance = await Broker.getInstance().getBalance(this.symbol);
        return balance.available;
    }
}


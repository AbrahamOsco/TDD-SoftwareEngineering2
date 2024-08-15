import { Log } from "../../logger/Log";
import { Observer } from "./DataService";

export class PriceObserver implements Observer {
  async update(): Promise<void> {
    Log.info(`Significant price change detected`);
  }
}

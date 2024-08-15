import { BinanceService } from "../../../market/services/BinanceService";
import { DataService, Observer } from "../../../market/services/DataService";
import { Rule } from "../Rule/Rule";
import { ZodParser } from "../ZodParser/ZodParser";

export class RuleEngine implements Observer {
  private rules: Rule[];

  public constructor(ruleName: string) {
    const zodParser = new ZodParser(ruleName);
    this.rules = zodParser.getRules();
  }

  public async update(): Promise<void> {
    await Promise.all(this.rules.map((aRule) => aRule.tryApplyActions()));
  }

  public start() {
    DataService.getInstance().addObserver(this);
    DataService.getInstance().setBinanceService(
      new BinanceService(DataService.getInstance()),
    );
  }
}


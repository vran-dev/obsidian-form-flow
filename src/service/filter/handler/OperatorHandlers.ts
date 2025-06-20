import { Filter } from "src/model/filter/Filter";
import { EqOperatorHandler } from "./common/EqOperatorHandler";
import { HasValueOperatorHandler } from "./common/HasValueOperatorHandler";
import { NotEqOperatorHandler } from "./common/NotEqOperatorHandler";
import { NoValueOperatorHandler } from "./common/NoValueOperatorHandler";
import { ContainsOperatorHandler } from "./list/ContainsOperatorHandler";
import { NotContainsOperatorHandler } from "./list/NotContainsOperatorHandler";
import { GteOperatorHandler } from "./number/GteOperatorHandler";
import { GtOperatorHandler } from "./number/GtOperatorHandler";
import { LteOperatorHandler } from "./number/LteOperatorHandler";
import { LtOperatorHandler } from "./number/LtOperatorHandler";

export class OperatorHandlers {

    static handlers = [
        new EqOperatorHandler(),
        new NotEqOperatorHandler(),
        new GtOperatorHandler(),
        new GteOperatorHandler(),
        new LtOperatorHandler(),
        new LteOperatorHandler(),
        new ContainsOperatorHandler(),
        new NotContainsOperatorHandler(),
        new HasValueOperatorHandler(),
        new NoValueOperatorHandler()
        // new InOperatorHandler(),
        // new NInOperatorHandler(),
        // new LikeOperatorHandler(),
        // new NotLikeOperatorHandler(),
    ]

    static apply(filter: Filter, fieldValue: any, value: any): boolean {
        const handler = this.handlers.find(h => h.accept(filter));
        if (handler) {
            return handler.apply(fieldValue, value, {
                filter: filter
            });
        }
        return false;
    }
}
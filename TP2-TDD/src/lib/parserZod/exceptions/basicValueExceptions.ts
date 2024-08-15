export class StringCantEvaluatedError extends Error{
    public constructor(message: string) {
        super(message);
    }
}

export class NumberCantEvaluatedError extends Error{
    public constructor(message: string) {
        super(message);
    }
}

export class BooleanCantBeAmountError extends Error{
    public constructor(message: string) {
        super(message);
    }
}

export class StringCantBeAmountError extends Error{
    public constructor(message: string) {
        super(message);
    }
}

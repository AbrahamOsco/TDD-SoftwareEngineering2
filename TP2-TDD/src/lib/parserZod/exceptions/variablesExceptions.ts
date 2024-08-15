export class ValueOfTheVariableDoesNotExistError extends Error{
    public constructor(message: string) {
        super(message);
    }
}

export class InvalidFormatFoundInJsonError extends Error{
    public constructor(message: string) {
        super(message);
    }
}


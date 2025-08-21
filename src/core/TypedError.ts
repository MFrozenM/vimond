export class TypedError {
    message: string;
    name: string = "TypedError";

    constructor(message: string) {
        this.message = message;
    }
}

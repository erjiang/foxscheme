/*
 * FoxScheme.Error
 *
 * A JavaScript Error to be thrown for errors arising from bad user
 * input (bad syntax, etc.)
 *
 */

export class Error {
    message: string;
    constructor(message: string, proc?: string) {
        if (proc) {
            this.message = `In ${proc}: ${message}`;
        } else {
            this.message = message;
        }
    }
    toString() { return "[ERROR] "+this.message; }
};

/*
 * FoxScheme.Bug
 *
 * A Javascript error to be thrown in an internal fault that
 * should never happen.
 *
 */

export class Bug {
    message: string;
    constructor(message: string, proc?: string) {
        if (proc) {
            this.message = `In ${proc}: ${message}`;
        } else {
            this.message = message;
        }
    }
    toString() { return "[BUG] " + this.message; }
};

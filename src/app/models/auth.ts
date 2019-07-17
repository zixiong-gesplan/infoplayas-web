export class Auth {
    constructor(
        public token: string,
        public expires: number,
        public username: string,
        public persist: boolean,
        public error: string,
    ) {
    }
}

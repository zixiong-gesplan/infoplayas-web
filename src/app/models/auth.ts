export class Auth {
    constructor(
        public token: string,
        public expires: number,
        public username: string
    ) {
    }
}

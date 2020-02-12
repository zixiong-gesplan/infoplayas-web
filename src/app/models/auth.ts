export class Auth {
    constructor(
        public token: string,
        public expires: number,
        public username: string,
        public persist: boolean,
        public roleId: string,
        public filter: string,
        public name: string
    ) {
    }
}

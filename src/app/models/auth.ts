export class Auth {
    constructor(
        public token: string,
        public expires: number,
        public username: string,
        public selectedusername: string,
        public persist: boolean,
        public editor: boolean
    ) {
    }
}

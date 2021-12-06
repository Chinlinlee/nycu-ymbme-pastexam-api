import { INYCUToken } from "./interfaces/IToken";

export class NYCUTokenDto implements INYCUToken {
    access_token: string;
    expire_in : number;
    refresh_token: string;
    scope: string;
    token_type: string;
    constructor(obj: object = {}) {
        Object.assign(this, obj);
    }

    toJson() {
        return {
            access_token: this.access_token
        }
    }
}
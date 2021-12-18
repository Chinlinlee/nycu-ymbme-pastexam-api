export interface INYCUToken {
    access_token: string;
    expire_in : number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export interface INYCUUser {
    username: string;
    email: string;
}
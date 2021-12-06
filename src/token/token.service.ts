import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { config } from 'src/config';

@Injectable()
export class TokenService {
    constructor(
        private http: HttpService
    ) {}

    getProfile(token: string): Observable<AxiosResponse<any>> {
        return this.http.get(config.ENV.nycuProfileApi , {
            headers : {
                "Authorization": `Bearer ${token}`
            }
        });
    }
}

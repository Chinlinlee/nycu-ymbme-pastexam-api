import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { NYCUTokenDto } from 'src/token/token.model';
import { config } from '../../config';
import { TokenService } from '../../token/token.service';


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private tokenService: TokenService
    ) {}

    async canActivate(context: ExecutionContext) {
        if (!config.ENV.isProduction) {
            return true;
        }
        let tokenStatus = await this.checkTokenStatus(context);
        return tokenStatus;
    }
    checkTokenStatus(context: ExecutionContext) : Promise<boolean>{
        return new Promise((resolve)=> {
            const req = context.switchToHttp().getRequest();
            let token: NYCUTokenDto = req.session["nycuToken"];
            let profile = this.tokenService.getProfile(token.access_token).pipe(
                map((res)=> {
                    return res.data;
                })
            );
            profile.subscribe({
                next: (data)=> {
                    req.session['nycuProfile'] = data;
                    resolve(true);
                },
                error: (err) => {
                    resolve(false);
                }
            });
        })
    }
}
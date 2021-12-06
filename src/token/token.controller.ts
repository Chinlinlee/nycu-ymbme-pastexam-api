import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { NYCUTokenDto } from './token.model';
import * as _ from 'lodash';
import { TokenService } from './token.service';
import { map } from 'rxjs/operators';

@Controller('token')
export class TokenController {
    constructor (
        private tokenService : TokenService
    ) {

    }
    @Get()
    async getToken(@Req() req: Request, @Res() res: Response) {
        let userNYCUToken: NYCUTokenDto|boolean = _.get(req , "session.nycuToken" , false)
        if (userNYCUToken) {
            let profile = await this.tokenService.getProfile((userNYCUToken as NYCUTokenDto).access_token).pipe(
                map((res)=> {
                    return res.data;
                })
            );
            console.log(profile);
            return res.status(200).send(userNYCUToken);
        }
        return res.status(401).send();
    }

    @Post()
    postToken(@Req() req: Request ,@Body() body: NYCUTokenDto, @Res() res: Response) {
        req.session["nycuToken"] = body.toJson();
        res.status(200).send();
    }
}

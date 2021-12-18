import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { NYCUTokenDto } from './token.model';
import * as _ from 'lodash';
import { TokenService } from './token.service';
import { map } from 'rxjs/operators';

@Controller('token')
export class TokenController {
    myLogger : Logger = new Logger(TokenController.name);
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
            
            return res.status(200).send(userNYCUToken);
        }
        return res.status(401).send();
    }

    @Get('/check')
    async getCheckTokenStatus(@Req() req: Request, @Res() res: Response) {
        let userNYCUToken: NYCUTokenDto = _.get(req , "session.nycuToken" , false);
        if (!userNYCUToken) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                statusCode: HttpStatus.UNAUTHORIZED,
                message: [
                    "unauthorized"
                ],
                error: "unauthorized"
            });
        }
        let profile = await this.tokenService.getProfile(userNYCUToken.access_token).pipe(
            map((res)=> {
                return res.data;
            })
        );
        profile.subscribe({
            next: (data)=> {
                this.myLogger.log(data);
                return res.status(200).send(data);
            },
            error: (err) => {
                this.myLogger.error(err);
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    statusCode: HttpStatus.UNAUTHORIZED,
                    message: [
                        "unauthorized"
                    ],
                    error: "unauthorized"
                });
            }
        });
    }

    @Post()
    postToken(@Req() req: Request ,@Body() body: NYCUTokenDto, @Res() res: Response) {
        req.session["nycuToken"] = body;
        res.status(200).send();
    }

    @Delete('/logout')
    postLogout(@Req() req: Request , @Res() res: Response) {
        req.session.destroy((err)=> {
            if (err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
            } else {
                res.status(HttpStatus.OK).send();
            }
        });
    }
}

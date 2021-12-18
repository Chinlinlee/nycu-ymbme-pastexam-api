import { Options } from "sequelize/types";


interface IEnv {
    fileStorePath: string;
    sessionSecret: string;
    nycuProfileApi: string;
    isProduction:boolean;
}

interface IConfig {
    SQL : Options;
    initSQL: boolean;
    initSQLData: boolean;
    ENV: IEnv;
}


export const config: IConfig = {
    SQL : {
        dialect: "mssql",
        username: "username",
        password: "password",
        database: "database",
        host: "localhost",
        port: 1433 
    },
    initSQL : false,//初始化整個sql table
    initSQLData: false,//初始化課程列表、老師
    ENV: {
        fileStorePath: "c:/" ,
        sessionSecret: "secret",
        nycuProfileApi: "https://id.nycu.edu.tw/api/profile/",
        isProduction: false
    }
}
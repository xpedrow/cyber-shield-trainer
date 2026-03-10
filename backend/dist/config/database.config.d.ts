declare const _default: (() => {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
    database: string;
    synchronize: boolean;
    logging: boolean;
}>;
export default _default;

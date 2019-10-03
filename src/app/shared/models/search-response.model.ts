export interface TradierSearchResponse {
    securities: TradierSecurities;
}

export interface TradierSecurities {
    security: TradierSecurity[];
}

export interface TradierSecurity {
    symbol: string;
    exchange: string;
    type: string;
    description: string;
}

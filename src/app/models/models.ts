export interface Health_indicators {
    temperature: number;
    pulsation: number;
}

export interface History {
    timestamp: Date;
    data: Health_indicators;
}
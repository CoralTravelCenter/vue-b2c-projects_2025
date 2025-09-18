interface ParentLocation {
    id: string;
    type: number;
    name: string;
    countryId: string;
}

export interface ArrivalLocation {
    id: string;
    type: number;
    name: string;
    friendlyUrl: string;
    parent?: ParentLocation;
    children?: any[];
}

export interface Category {
    name: string;
    starCount: number;
}

export interface Hotel {
    name: string;
    location: string;
    benefits: string[];
    erid: string;
    ligal: string
}


declare global {
    function ym(
        counterId: number,
        action: string,
        target?: string,
        params?: Record<string, any>
    ): void
}

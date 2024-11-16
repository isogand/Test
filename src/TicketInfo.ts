interface InitialState {
    _id: string;
    orgCity: string,
    orgCityId: number,
    orgCityInitials: string,
    desCity: string,
    desCityId: number,
    desCityInitials: string,
    flightType:string,
    id : string;
    adultFare: string | null;
    AirportOrgCity:string,
    AirportDesCity:string,
    adultPrice: string;

    adultTotalTax: any;

    arrivalDateTime:Date | null;

    childFare: string | null;

    childPrice: string  ;

    childTotalTax: any;

    constAirCraft: string | null;

    constAirlineId: any;

    constAvailability: any;

    constCRCN: any;

    constCurrencyId: any;

    constDestination: any;

    constIsRefundable: any;

    constOrigin: any;

    departureDateTime: Date | null;

    extraBaggageId: null | any

    flightNo: number | null;

    infantFare:string | null;

    infantPrice: string;

    infantTotalTax: any;

    isDomestic:boolean;

    isLeapYear: boolean;

    transit: boolean;

    date: string;

    passengers: {
        adult: number,
        child: number,
        newBorn: number
    }

    selectedPassengers : any[];

    oneWayDate: string | Date | null | undefined;
    twoWayDate : string | null; //Return Date if available

    time?: string; // Add the 'time' property here
    destime?: string;
    searchHistory:any;
    BaggageAllowanceWeight:string | null;
    inIrandesCity:boolean,
    inIranorgCity:boolean,
    availability:string | null;
    discounted:boolean,
    discountedAdultPrice:string,
    discountedChildPrice: string,
    discountedInfantPrice: string,
}
export interface TicketTicketList {
    _id: string;
    BaggageAllowanceWeight: string;
    CRCNRules: any[][]; // Adjust the type of CRCNRules based on its actual structure
    adultFare: string;
    adultPrice: string;
    adultTaxes: string[];
    airlineId: {
        enName: string;
        faName: string;
        icon: any[]; // Adjust the type of icon based on its actual structure
    };
    airplaneId: {
        abbreviation: string;
    };
    arrivalDateTime: string;
    availability: string;
    childFare: string;
    childPrice: string;
    childTaxes: string[];
    classStatus: string;
    departureDateTime: string;
    destinationId: {
        airport: string;
        initial: string;
        persian: string;
    };
    flightNo: number;
    infantFare: string;
    infantPrice: string;
    infantTaxes: string[];
    isDomestic: boolean;
    lastUpdateDate: string;
    originId: {
        airport: string;
        initial: string;
        persian: string;
    };

}
export interface ApiResponse {
    tickets: TicketTicketList[];
}

const UpdateCounterAction: string = "ticket";

export default InitialState;
export { UpdateCounterAction };

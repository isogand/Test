import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PassengerType } from "../Constants/interfaces/IPassenger";
import InitialState from "../Constants/interfaces/TicketInfo";

// Helper function to check if the flight has expired
const isFlightExpired = (flightDate: string) => {
    const flightDateObj = new Date(flightDate);
    const currentDate = new Date();
    return flightDateObj < currentDate;
};
const initialState: InitialState = {
    id: "",
    orgCity: "",
    orgCityId: 0,
    orgCityInitials: "",
    date: "",
    desCity: "",
    desCityId: 0,
    desCityInitials: "",
    adultFare: "",
    adultPrice: "",
    adultTotalTax: {},
    arrivalDateTime: "",
    childFare: "",
    childPrice: "",
    childTotalTax: {},
    constAirCraft: "",
    constAirlineId: {},
    constAvailability: {},
    constCRCN: {},
    constCurrencyId: {},
    constDestination: {},
    constIsRefundable: {},
    constOrigin: {},
    departureDateTime: "",
    extraBaggageId: null,
    flightNo: 0,
    infantFare: "",
    infantPrice: "",
    infantTotalTax: {},
    isDomestic: true,
    isLeapYear: false,
    transit: false,
    passengers: {
        adult: 1,
        child: 0,
        newBorn: 0,
    },
    selectedPassengers: [],
    oneWayDate: "",
    twoWayDate: "",
    // oneWayDate: new Date(),
    // twoWayDate: new Date()
    searchHistory: [],
    BaggageAllowanceWeight:"",
    inIrandesCity:true,
    inIranorgCity:true,
    discountedAdultPrice:"",
    discountedChildPrice: "",
    discountedInfantPrice: "",
    AirportDesCity: "", AirportOrgCity: "", _id: "", availability: "", discounted: false, flightType: "",
};
const MAX_SEARCH_HISTORY_LENGTH = 4;
const TicketInfoSlice = createSlice({
    name: "ticketInfo",
    initialState: initialState,
    reducers: {
        setTicketInformation: (state, action: PayloadAction<Partial<InitialState>>) => {
            return { ...state, ...action.payload };
        },

        setInfoFirstLevel: (state, action: PayloadAction<InitialState>) => {
            return {
                ...state,
                ...action.payload,
            };
        },

        setInfoPassengers: (state, action: PayloadAction<PassengerType[]>) => {
            const newPassengers = action.payload;
            state.selectedPassengers = [...newPassengers];
        },

        addSearchToHistory: (state, action: PayloadAction<InitialState>) => {
            const newSearch = action.payload;
            // Remove any expired flights from searchHistory before adding a new one
            state.searchHistory = state.searchHistory.filter(
                (search) => !isFlightExpired(search.date)
            );

            // Find the index of the existing search with the same desCity, orgCity, and date
            const existingIndex = state.searchHistory.findIndex(
                (history: InitialState) =>
                    history.AirportDesCity === newSearch.AirportDesCity &&
                    history.AirportOrgCity === newSearch.AirportOrgCity &&
                    history.date === newSearch.date
            );

            if (existingIndex !== -1) {
                // Update existing search entry
                state.searchHistory[existingIndex] = newSearch;
            } else {
                // Add new search entry
                state.searchHistory.unshift(newSearch); // Add to the beginning of the array

                // Ensure the array doesn't exceed the maximum length
                if (state.searchHistory.length > MAX_SEARCH_HISTORY_LENGTH) {
                    state.searchHistory = state.searchHistory.slice(0, MAX_SEARCH_HISTORY_LENGTH);
                }
            }
        },
        removePassenger: (state, action: PayloadAction<number>) => {
            const passengerType = action.payload;

            if (passengerType === 0 && state.passengers.adult > 1) {
                state.passengers.adult--;
            } else if (passengerType === 1 && state.passengers.child > 0) {
                state.passengers.child--;
            } else if (passengerType === 2 && state.passengers.newBorn > 0) {
                state.passengers.newBorn--;
            }
        },
        addPassenger: (state, action: PayloadAction<string>) => {
            const passengerType = action.payload;

            if (passengerType === 'بزرگسال') state.passengers.adult++;
            else if (passengerType === 'کودک') state.passengers.child++;
            else if (passengerType === 'نوزاد') state.passengers.newBorn++;
        },
        removeSearchFromHistory: (state, action) => {
            // Use filter or splice to remove the specific search item based on the passed index
            const indexToRemove = action.payload;
            state.searchHistory = state.searchHistory.filter((_, index) => index !== indexToRemove);
        },
    }
});

export const {
    setTicketInformation,
    setInfoFirstLevel,
    setInfoPassengers,
    addSearchToHistory,
    removePassenger,
    addPassenger,
    removeSearchFromHistory
} = TicketInfoSlice.actions;

export default TicketInfoSlice.reducer;

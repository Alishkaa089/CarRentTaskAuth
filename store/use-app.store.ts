import { CarModel } from "@/types/car-model.types";
import { create } from "zustand";

export interface Booking {
    id: string;
    carId: string;
    car: CarModel;
    startDate: string;   
    endDate: string;     
    pickupTime: string;  
    returnTime: string;  
    withDriver: boolean;
    totalPrice: number;
    cardLastFour: string;
    bookedAt: string;    
}

export interface PaymentCard {
    id: string;
    lastFour: string;
    expiry: string;
    type: "visa" | "mastercard" | "amex" | "other";
}

interface AppState {
    
    selectedCar: CarModel | null;
    setSelectedCar: (car: CarModel | null) => void;

    bookingDraft: {
        startDate: string | null;
        endDate: string | null;
        pickupTime: string;
        returnTime: string;
        withDriver: boolean;
    };
    setBookingDraft: (draft: Partial<AppState["bookingDraft"]>) => void;
    clearBookingDraft: () => void;

    
    paymentCards: PaymentCard[];
    activeCard: PaymentCard | null;
    addPaymentCard: (card: PaymentCard) => void;
    setActiveCard: (card: PaymentCard) => void;
    removePaymentCard: (id: string) => void;

    
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    cancelBooking: (id: string) => void;

    
    checkAvailability: (carId: string, startDate: string, endDate: string) => boolean;
    getCarBookings: (carId: string) => Booking[];
    getUserBookings: () => Booking[];
}

export const useAppStore = create<AppState>((set, get) => ({
    
    selectedCar: null,
    setSelectedCar: (car) => set({ selectedCar: car }),

    
    bookingDraft: {
        startDate: null,
        endDate: null,
        pickupTime: "10:00",
        returnTime: "17:00",
        withDriver: false,
    },
    setBookingDraft: (draft) =>
        set((state) => ({
            bookingDraft: { ...state.bookingDraft, ...draft },
        })),
    clearBookingDraft: () =>
        set({
            bookingDraft: {
                startDate: null,
                endDate: null,
                pickupTime: "10:00",
                returnTime: "17:00",
                withDriver: false,
            },
        }),

    
    paymentCards: [],
    activeCard: null,
    addPaymentCard: (card) =>
        set((state) => {
            const exists = state.paymentCards.find((c) => c.id === card.id);
            const cards = exists ? state.paymentCards : [...state.paymentCards, card];
            return { paymentCards: cards, activeCard: card }; 
        }),
    setActiveCard: (card) => set({ activeCard: card }),
    removePaymentCard: (id) =>
        set((state) => {
            const updated = state.paymentCards.filter((c) => c.id !== id);
            const active = state.activeCard?.id === id ? (updated[0] ?? null) : state.activeCard;
            return { paymentCards: updated, activeCard: active };
        }),

    
    bookings: [],
    addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
    cancelBooking: (id) =>
        set((state) => ({
            bookings: state.bookings.filter((b) => b.id !== id),
        })),

    
    checkAvailability: (carId, startDate, endDate) => {
        const carBookings = get().bookings.filter((b) => b.carId === carId);
        const newStart = new Date(startDate).getTime();
        const newEnd = new Date(endDate).getTime();

        for (const b of carBookings) {
            const bStart = new Date(b.startDate).getTime();
            const bEnd = new Date(b.endDate).getTime();
            if (newStart <= bEnd && newEnd >= bStart) return false; 
        }
        return true;
    },

    getCarBookings: (carId) => get().bookings.filter((b) => b.carId === carId),
    getUserBookings: () => get().bookings,
}));

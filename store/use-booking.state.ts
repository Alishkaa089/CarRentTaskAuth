import { create } from 'zustand';

export interface Booking {
    id: string;
    carId: string;
    startDate: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    withDriver: boolean;
}

interface BookingState {
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    checkAvailability: (carId: string, startDate: string, endDate: string) => boolean;
    getCarBookings: (carId: string) => Booking[];
}

export const useBookingState = create<BookingState>((set, get) => ({
    bookings: [],
    addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
    
    
    checkAvailability: (carId, startDate, endDate) => {
        const { bookings } = get();
        const carBookings = bookings.filter((b) => b.carId === carId);
        
        const newStart = new Date(startDate).getTime();
        const newEnd = new Date(endDate).getTime();

        for (const b of carBookings) {
            const bStart = new Date(b.startDate).getTime();
            const bEnd = new Date(b.endDate).getTime();
            
            
            
            if (newStart <= bEnd && newEnd >= bStart) {
                return false; 
            }
        }
        return true; 
    },

    getCarBookings: (carId) => {
        return get().bookings.filter((b) => b.carId === carId);
    }
}));

'use client';

import { create } from 'zustand';
import type { PackageState, PackageActions, BudgetTier, FlightClass, TransportType, ComfortLevel } from '@/types';

const BUDGET_BASE: Record<NonNullable<BudgetTier>, number> = {
  budget: 80000, standard: 150000, premium: 280000, luxury: 500000, ultra: 1000000,
};
const FLIGHT_MULT: Record<NonNullable<FlightClass>, number> = {
  economy: 1, premium_economy: 1.4, business: 2.2, first: 3.5,
};
const TRANSPORT_MULT: Record<NonNullable<TransportType>, number> = {
  shared: 1, private: 1.15, luxury: 1.35,
};
const COMFORT_MULT: Record<NonNullable<ComfortLevel>, number> = {
  basic: 0.75, comfortable: 1, premium: 1.4, luxury: 2,
};

function computePrice(s: Partial<PackageState>): number {
  const base = s.budgetTier ? BUDGET_BASE[s.budgetTier] : 150000;
  const pax = Math.max(1, (s.travelers?.males ?? 0) + (s.travelers?.females ?? 0)) + (s.travelers?.children ?? 0) * 0.7;
  const flight = s.flightClass ? FLIGHT_MULT[s.flightClass] : 1;
  const transport = s.transportType ? TRANSPORT_MULT[s.transportType] : 1;
  const comfort = s.comfortLevel ? COMFORT_MULT[s.comfortLevel] : 1;
  const hotel = s.selectedHotel ? s.selectedHotel.pricePerNight * 5 : 0;
  const activities = s.selectedActivities?.reduce((sum, a) => sum + a.price, 0) ?? 0;
  const extras = (s.specialRequirements?.length ?? 0) * 3000;
  return Math.round((base * comfort + hotel + activities + extras) * pax * flight * transport);
}

function computeScore(s: Partial<PackageState>): number {
  let score = 40;
  if (s.destination) score += 10;
  if (s.travelerType) score += 5;
  if (s.dateRange?.from) score += 8;
  if (s.budgetTier || s.comfortLevel) score += 7;
  if (s.flightClass) score += 8;
  if (s.selectedHotel || (s.comfortLevel && s.roomType)) score += 10;
  if ((s.selectedActivities?.length ?? 0) > 0) score += 7;
  if (s.transportType) score += 5;
  return Math.min(score, 99);
}

const initial: PackageState = {
  currentStep: 0,
  travelType: null,
  destination: null,
  travelerType: null,
  travelers: { males: 1, females: 1, children: 0, infants: 0 },
  dateRange: { from: null, to: null },
  budgetTier: null,
  budgetAmount: 150000,
  flightClass: null,
  selectedHotel: null,
  selectedActivities: [],
  transportType: null,
  specialRequirements: [],
  leadName: '', leadPhone: '', leadEmail: '',
  roomType: null,
  comfortLevel: null,
  hotelLocation: null,
  mealPlanPreference: null,
  departureCity: null,
  hotelDistanceFromHaram: null,
  groupOrPrivate: null,
  mealsIncluded: true,
  includesMadinah: true,
  elderlyAssistance: false,
  directFlightPreferred: false,
  hajjUmrahDuration: 14,
  estimatedPrice: 150000,
  packageScore: 40,
};

function withComputed(patch: Partial<PackageState>, base: PackageState) {
  const next = { ...base, ...patch };
  return { ...patch, estimatedPrice: computePrice(next), packageScore: computeScore(next) };
}

export const usePackageStore = create<PackageState & PackageActions>((set, get) => ({
  ...initial,

  setStep: (currentStep) => set({ currentStep }),
  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),

  setTravelType: (travelType) => set((s) => withComputed({ travelType }, s as PackageState)),
  setDestination: (destination) => set((s) => withComputed({ destination }, s as PackageState)),
  setTravelerType: (travelerType) => set((s) => withComputed({ travelerType }, s as PackageState)),
  setTravelers: (travelers) => set((s) => withComputed({ travelers }, s as PackageState)),
  setDateRange: (dateRange) => set((s) => withComputed({ dateRange }, s as PackageState)),
  setBudgetTier: (budgetTier) => set((s) => {
    const budgetAmount = budgetTier ? BUDGET_BASE[budgetTier] : s.budgetAmount;
    return withComputed({ budgetTier, budgetAmount }, s as PackageState);
  }),
  setBudgetAmount: (budgetAmount) => set((s) => withComputed({ budgetAmount }, s as PackageState)),
  setFlightClass: (flightClass) => set((s) => withComputed({ flightClass }, s as PackageState)),
  setSelectedHotel: (selectedHotel) => set((s) => withComputed({ selectedHotel }, s as PackageState)),
  toggleActivity: (activity) => set((s) => {
    const exists = s.selectedActivities.find((a) => a.id === activity.id);
    const selectedActivities = exists
      ? s.selectedActivities.filter((a) => a.id !== activity.id)
      : [...s.selectedActivities, activity];
    return withComputed({ selectedActivities }, s as PackageState);
  }),
  setTransportType: (transportType) => set((s) => withComputed({ transportType }, s as PackageState)),
  toggleSpecialRequirement: (id) => set((s) => {
    const specialRequirements = s.specialRequirements.includes(id)
      ? s.specialRequirements.filter((r) => r !== id)
      : [...s.specialRequirements, id];
    return withComputed({ specialRequirements }, s as PackageState);
  }),
  setLeadInfo: (leadName, leadPhone, leadEmail) => set({ leadName, leadPhone, leadEmail }),

  setRoomType: (roomType) => set((s) => withComputed({ roomType }, s as PackageState)),
  setComfortLevel: (comfortLevel) => set((s) => withComputed({ comfortLevel }, s as PackageState)),
  setHotelLocation: (hotelLocation) => set((s) => withComputed({ hotelLocation }, s as PackageState)),
  setMealPlanPreference: (mealPlanPreference) => set({ mealPlanPreference }),

  setDepartureCity: (departureCity) => set({ departureCity }),
  setHotelDistanceFromHaram: (hotelDistanceFromHaram) => set((s) => withComputed({ hotelDistanceFromHaram }, s as PackageState)),
  setGroupOrPrivate: (groupOrPrivate) => set({ groupOrPrivate }),
  setMealsIncluded: (mealsIncluded) => set({ mealsIncluded }),
  setIncludesMadinah: (includesMadinah) => set({ includesMadinah }),
  setElderlyAssistance: (elderlyAssistance) => set({ elderlyAssistance }),
  setDirectFlightPreferred: (directFlightPreferred) => set({ directFlightPreferred }),
  setHajjUmrahDuration: (hajjUmrahDuration) => set({ hajjUmrahDuration }),

  reset: () => set(initial),
}));

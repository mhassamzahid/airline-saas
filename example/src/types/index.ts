export type TravelType = 'international' | 'pakistan' | 'hajj' | 'umrah' | null;
export type TravelerType = 'solo' | 'couple' | 'family' | 'group' | null;
export type FlightClass = 'economy' | 'premium_economy' | 'business' | 'first' | null;
export type BudgetTier = 'budget' | 'standard' | 'premium' | 'luxury' | 'ultra' | null;
export type TransportType = 'shared' | 'private' | 'luxury' | null;
export type RoomType = 'single' | 'double' | 'triple' | 'quad' | 'suite' | null;
export type ComfortLevel = 'basic' | 'comfortable' | 'premium' | 'luxury' | null;
export type HotelLocation = 'centre' | 'attractions' | 'beach' | 'quiet' | null;

export interface Travelers {
  males: number;
  females: number;
  children: number;
  infants: number;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  pricePerNight: number;
  image: string;
  location: string;
  amenities: string[];
  mealPlan: string;
  distanceFromHaram?: string;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  price: number;
  duration: string;
  image: string;
  category: string;
}

export interface PackageState {
  currentStep: number;
  travelType: TravelType;
  destination: string | null;
  travelerType: TravelerType;
  travelers: Travelers;
  dateRange: DateRange;
  budgetTier: BudgetTier;
  budgetAmount: number;
  flightClass: FlightClass;
  selectedHotel: Hotel | null;
  selectedActivities: Activity[];
  transportType: TransportType;
  specialRequirements: string[];
  leadName: string;
  leadPhone: string;
  leadEmail: string;

  // Hotel preferences (used across all flows)
  roomType: RoomType;
  comfortLevel: ComfortLevel;
  hotelLocation: HotelLocation;
  mealPlanPreference: string | null;

  // Hajj / Umrah specific
  departureCity: string | null;
  hotelDistanceFromHaram: string | null;
  groupOrPrivate: 'group' | 'private' | null;
  mealsIncluded: boolean;
  includesMadinah: boolean;
  elderlyAssistance: boolean;
  directFlightPreferred: boolean;
  hajjUmrahDuration: number;

  // Computed
  estimatedPrice: number;
  packageScore: number;
}

export interface PackageActions {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setTravelType: (type: TravelType) => void;
  setDestination: (dest: string) => void;
  setTravelerType: (type: TravelerType) => void;
  setTravelers: (t: Travelers) => void;
  setDateRange: (range: DateRange) => void;
  setBudgetTier: (tier: BudgetTier) => void;
  setBudgetAmount: (amount: number) => void;
  setFlightClass: (cls: FlightClass) => void;
  setSelectedHotel: (hotel: Hotel | null) => void;
  toggleActivity: (activity: Activity) => void;
  setTransportType: (type: TransportType) => void;
  toggleSpecialRequirement: (id: string) => void;
  setLeadInfo: (name: string, phone: string, email: string) => void;
  setRoomType: (r: RoomType) => void;
  setComfortLevel: (c: ComfortLevel) => void;
  setHotelLocation: (l: HotelLocation) => void;
  setMealPlanPreference: (m: string | null) => void;
  setDepartureCity: (city: string) => void;
  setHotelDistanceFromHaram: (d: string) => void;
  setGroupOrPrivate: (v: 'group' | 'private') => void;
  setMealsIncluded: (v: boolean) => void;
  setIncludesMadinah: (v: boolean) => void;
  setElderlyAssistance: (v: boolean) => void;
  setDirectFlightPreferred: (v: boolean) => void;
  setHajjUmrahDuration: (n: number) => void;
  reset: () => void;
}

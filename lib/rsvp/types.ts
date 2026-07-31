export const PERSON_TYPES = ["adult", "child"] as const;
export type PersonType = (typeof PERSON_TYPES)[number];

export const DIETARY_CHOICES = [
  "none",
  "vegetarian",
  "vegan",
  "gluten-free",
  "lactose-free",
  "other",
] as const;
export type DietaryChoice = (typeof DIETARY_CHOICES)[number];

export type TransportRequest = {
  needsTransport: boolean;
  transportDestination?: string;
};

export type DietaryRequirement = {
  dietaryChoice: DietaryChoice;
  dietaryDetails?: string;
};

export type Person = TransportRequest &
  DietaryRequirement & {
    id: string;
    firstName: string;
    lastName: string;
    type: PersonType;
    overnightStay: boolean;
    note?: string;
  };

export type RsvpOwner = {
  ownerEmail: string;
};

export type RsvpTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

export type Rsvp = RsvpOwner &
  RsvpTimestamps & {
    persons: Person[];
    sharedMessage?: string;
  };

export type AdminFilters = {
  search?: string;
  personType?: PersonType;
  overnightStay?: boolean;
  dietaryChoice?: DietaryChoice;
};

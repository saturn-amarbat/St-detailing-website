import { z } from "zod";

export const vehicleSizes = [
  {
    id: "sedan-coupe",
    label: "Sedan/Coupe",
    shortLabel: "Sedan",
    adjustment: 0,
    description: "Compact cars, coupes, and standard sedans."
  },
  {
    id: "small-suv-crossover",
    label: "Small SUV/Crossover",
    shortLabel: "Small SUV",
    adjustment: 20,
    description: "Crossovers, small SUVs, and compact wagons."
  },
  {
    id: "large-suv-truck",
    label: "Large SUV/Truck",
    shortLabel: "Large SUV",
    adjustment: 40,
    description: "Trucks, 3-row SUVs, and larger family vehicles."
  }
] as const;

export const packages = [
  {
    id: "resale-restoration",
    name: "Resale Restoration",
    basePrice: 349,
    image: "/pricing-drill-brush.png",
    description: "Listing-ready reset for private sales, trade-ins, and premium presentation.",
    features: [
      "Deep interior cleaning with targeted spot treatment",
      "Paint decontamination and gloss enhancement",
      "Trim refresh, tire finish, and final walkaround"
    ],
    featured: false
  },
  {
    id: "the-deep-clean",
    name: "The Deep Clean",
    basePrice: 199,
    image: "/pricing-foam-cannon.png",
    description: "Full interior reset plus a gloss-focused exterior for the best all-around result.",
    features: [
      "Steam Cleaning Included",
      "2-Man Rapid Assembly Line Workflow",
      "Foam wash, wheel cleaning, tire dressing, and spray sealant"
    ],
    featured: true
  },
  {
    id: "express-refresh",
    name: "Express Refresh",
    basePrice: 89,
    image: "/pricing-tire.png",
    description: "Maintenance clean for lightly used vehicles that need a sharp reset.",
    features: [
      "Exterior hand wash and wheel face cleaning",
      "Interior vacuum and quick wipe-down",
      "Glass cleaned inside and out"
    ],
    featured: false
  }
] as const;

export const addons = [
  {
    id: "pet-hair-removal",
    name: "Pet Hair Removal",
    price: 35,
    description: "Targeted fabric, carpet, and cargo-area hair removal."
  },
  {
    id: "odor-treatment",
    name: "Odor Treatment",
    price: 40,
    description: "Deodorizing treatment for food, smoke, pet, or stale cabin odors."
  },
  {
    id: "engine-bay-cleaning",
    name: "Engine Bay Cleaning",
    price: 50,
    description: "Careful engine bay cleaning and dressing for a sharper presentation."
  }
] as const;

const vehicleSizeIds = vehicleSizes.map((vehicleSize) => vehicleSize.id) as [
  (typeof vehicleSizes)[number]["id"],
  ...(typeof vehicleSizes)[number]["id"][]
];

const packageIds = packages.map((servicePackage) => servicePackage.id) as [
  (typeof packages)[number]["id"],
  ...(typeof packages)[number]["id"][]
];

const addonIds = addons.map((addon) => addon.id) as [
  (typeof addons)[number]["id"],
  ...(typeof addons)[number]["id"][]
];

export const bookingSchema = z.object({
  vehicleSize: z.enum(vehicleSizeIds),
  selectedPackage: z.enum(packageIds),
  addons: z.array(z.enum(addonIds)).default([]),
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  preferredDate: z.string().min(1, "Choose a preferred date."),
  preferredTime: z.string().min(1, "Choose a preferred time."),
  calculatedTotal: z.number().int().min(89)
});

export type VehicleSizeId = (typeof vehicleSizes)[number]["id"];
export type PackageId = (typeof packages)[number]["id"];
export type AddonId = (typeof addons)[number]["id"];
export type BookingFormValues = z.infer<typeof bookingSchema>;

export function getVehicleSize(vehicleSizeId: VehicleSizeId) {
  return vehicleSizes.find((vehicleSize) => vehicleSize.id === vehicleSizeId) ?? vehicleSizes[0];
}

export function getPackage(packageId: PackageId) {
  return packages.find((servicePackage) => servicePackage.id === packageId) ?? packages[0];
}

export function calculateTotal(vehicleSizeId: VehicleSizeId, packageId: PackageId, selectedAddons: AddonId[]) {
  const vehicleSize = getVehicleSize(vehicleSizeId);
  const servicePackage = getPackage(packageId);
  const addonTotal = selectedAddons.reduce((total, addonId) => {
    const addon = addons.find((item) => item.id === addonId);
    return total + (addon?.price ?? 0);
  }, 0);

  return servicePackage.basePrice + vehicleSize.adjustment + addonTotal;
}

export function encodeNetlifyForm(data: Record<string, string>) {
  return new URLSearchParams(data).toString();
}

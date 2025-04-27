export interface DeliveryZone {
  _id?: string;
  name: string;
  regions: string[];
  baseCharge: number;
  weightRate: number;
  volumetricRate: number;
  estimatedDays: number;
}

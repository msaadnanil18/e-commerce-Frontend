interface ServiceCharge {
  _id: string;
  category: {
    _id: string;
    title: string;
  };
  chargeType: 'percentage' | 'flat';
  value: number;
  minOrderValue?: number;
  applicableStates?: string[];
}

export interface ServiceChargeFormData {
  category: string;
  chargeType: 'percentage' | 'flat';
  value: number;
  minOrderValue?: number;
  applicableStates?: string;
}

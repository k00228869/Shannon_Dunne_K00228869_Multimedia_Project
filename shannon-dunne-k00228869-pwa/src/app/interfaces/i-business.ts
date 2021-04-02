export interface IBusiness {
    business?: {
        id: string,
        profileCreated?: boolean,
        businessName: string,
        businessDescription: string,
        eircode: string,
        county: string,
        businessType?: string,
        reminderMessage?: string,
        cancellationPolicy?: string,
        price?: string,
        rating: number;
        img: string;
    };
}

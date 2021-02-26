export interface IUser {
    user: {
        uid: string;
        email: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        phone?: number;
        profileImg?: string;
        admin?: boolean;
    };
    slides?: {
        imageURL: string;
    };
    business?: {
        id: string,
        profileCreated?: boolean,
        businessName: string,
        businessDescription: string,
        eircode: string,
        county: string,
        businessTyp?: string,
        reminderMessage?: string,
        isMobile?: boolean,
        cancellationPolicy?: string,
        hours?: number[],
    };
    hours?: {
        monday: number;
        tuesday: number;
        wednesday: number;
        thursday: number;
        friday: number;
        saturday: number;
        sunday: number;
    };
    reviews?: {
        date?: number;
        id: number;
        rating: number;
        name: string;
        description: string;
        business: string;
        comment: string; }[];
    employee?: {
        id: string,
        firstName: string,
        lastName: string,
        employeeDescription: string,
        employeeServices?: string,
        emloyeeImg?: string,
        // days?: string;
         };
    service?: {
        id: string,
        serviceName: string,
        serviceDescription: string,
        servicePrice: number,
        duration: string };
}

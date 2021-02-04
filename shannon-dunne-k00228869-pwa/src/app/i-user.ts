export interface IUser {
    user: {
        uid: string;
        email: string;
        password?: string;
        displayName?: string;
        lastName?: string;
        phone?: number;
        profileImg?: string

        // roles: {
        //     subscriber?: boolean;
        //     editor?: boolean;
        //     admin?: boolean;
        // };
    };
    slides?: {
        image: string,
    }[];
    business?: {
        id: number,
        profileCreated: boolean;
        businessName: string,
        businessDescription: string,
        eircode: string,
        county: string,
        phoneNumber: string,
        businessType: string,
        reminderMessage: string,
        isMobile: boolean,
        cancellationPolicy?: string,
    };
    reviews?: {
        date?: number;
        id: number;
        rating: number;
        name: string;
        description: string;
        business: string;
        comment: string; }[];
    employees?: {
        id: number;
        firstName: string;
        lastName: string;
        employeeDescription: string;
        employeeServices: string;
        emloyeeImg: string;
        // days?: string;
        hours?: string; }[];
    services?: {
        id: number;
        serviceName: string;
        serviceDescription: string;
        servicePrice: number;
        duration: number; }[];
}

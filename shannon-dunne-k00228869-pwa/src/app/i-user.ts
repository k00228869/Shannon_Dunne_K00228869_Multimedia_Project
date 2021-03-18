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
    scheduleOfDays: {
        monday?: string[];
        tuesday?: string[];
        wednesday?: string[];
        thursday?: string[];
        friday?: string[];
        saturday?: string[];
        sunday?: string[];
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
    review?: {
        timestamp?: Date;
        uid: string;
        rating: number;
        bid: string;
        name: string;
        comment: string;
        id: string;
        reply: string;
    };
    employee?: {
        id: string,
        firstName: string,
        lastName: string,
        employeeDescription: string,
        employeeServices?: string,
         };
    service?: {
        id: string,
        serviceName: string,
        serviceDescription: string,
        servicePrice: number,
        duration: string,
        };
    appointment?: {
        employeeId: string,
        empName: string,
        serviceId: string,
        serName: string
        serPrice: number,
        serDuration: string,
        date: string,
        time: string,
        note?: string,
        bid?: string,
        uid?: string,
        clientName: string
        appointmentId?: string,
        timeStamp?: Date,
    };
    bookingSchedule?:
    {
        date?: string;
        availableTimes?: string[];
    };
    client?: {
        name: string;
        uid: string;
        phone: string;
        paymentInfo: string[];
    };
    subscription?: {
    // userId?: string,
    // endpoint: string,
    // expirationTime: null | number,
    // keys: {
    //     p256dh: string,
    //     auth: string
    //     }
    token?: any;
    id?: string;
    };
}

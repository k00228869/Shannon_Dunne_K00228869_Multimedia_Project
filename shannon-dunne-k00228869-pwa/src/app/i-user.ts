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
        businessType?: string,
        reminderMessage?: string,
        isMobile?: boolean,
        cancellationPolicy?: string,
        hours?: number[],
        price?: string,
        rating: number;
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
        uid?: string;
        rating?: number;
        bid?: string;
        name?: string;
        comment?: string;
        id?: string;
        reply?: string | null;
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
        discount?: string,
    };
    bookingSchedule?:
    {
        date?: string;
        availableTimes?: string[];
    };
    subscription?: {
    token?: any;
    id?: string;
    };
    notificationMessage?: {
        infoId?: string;
    message?: {
        token?: string;
        id?: string;
        notification?: {
            title?: string;
            body?: string;
            icon: string;
            click_action?: string;
            }
        }
    };
    cancellation?: {
        id?: string;
    };
}

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
    imageURL?: string[];
  };
  scheduleOfDays: {
    monday?: any[];
    tuesday?: any[];
    wednesday?: any[];
    thursday?: any[];
    friday?: any[];
    saturday?: any[];
    sunday?: any[];
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
    timestamp?: string;
    uid?: string;
    rating?: number;
    bid?: string;
    name?: string;
    comment?: string;
    id?: string;
    reply?: string | null;
  };
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeDescription: string;
    employeeServices?: string;
  };
  service?: {
    id: string;
    serviceName: string;
    serviceDescription: string;
    servicePrice: number;
    duration: string;
  };
  appointment?: {
    employeeId: string;
    empName: string;
    serviceId: string;
    serName: string;
    serPrice: number;
    serDuration: string;
    date: string;
    time: string;
    note?: string;
    bid?: string;
    uid?: string;
    clientName: string;
    appointmentId?: string;
    timeStamp?: Date;
    discount?: string;
    phone?: string;
  };
  bookingSchedule?: {
    date?: string;
    availableTimes?: string[];
    calendarIndex?: string;
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
      };
    };
  };
  cancellation?: {
    id?: string;
  };
}

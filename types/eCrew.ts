export interface ECrewDuty {
    date_sort:    number;
    start_date:   string;
    end_date:     string;
    start:        string;
    end:          string;
    legs:         any[];
    report:       string;
    debrief:      string;
    delay:        string;
    type:         Type;
    resource:     Resource;
    id:           string;
    all_day:      number | null;
    text:         string;
    details:      string;
    color:        Color;
    recurring:    null;
    calendar:     number;
    location:     Location;
    Memo:         boolean;
    Notification: boolean;
    IsDeadhead:   boolean;
    WillingToFly: boolean;
    NoContact:    boolean;
    ReplaceGDO:   boolean;
    HotelNo:      number;
    HotelInfo:    HotelInfo | null;
    barHidden:    boolean;
    RequiredRest: number;
    invert_times: boolean;
    sort:         Sort;
    ver:          number;
    charterer:    string;
    open:         boolean;
}

export interface HotelInfo {
    HotelActive:          number;
    HotelName:            string;
    ADDRESS:              string;
    SCHECKIN:             string;
    SCHECKOUT:            string;
    CONTACT_NAME1:        string;
    CONTACT_NAME2:        string;
    DISTANCE:             number;
    SDISTANCE:            string;
    FAX1:                 string;
    FAX2:                 string;
    TELEPHONE1:           string;
    TELEPHONE2:           string;
    ShuttleBusrequired:   boolean;
    Emails:               any[];
    HotelMemo:            string;
    PortHotelLatitude:    number;
    PortHotelLongitude:   number;
    HotelReference:       string;
    CheckInTime:          string;
    CheckOutTime:         string;
    CheckInDate:          Date;
    CheckOutDate:         string;
    AirportToHotel:       string;
    HotelToAirport:       string;
    PickUpAirportDate:    string;
    PickUpHotelDate:      string;
    PickUpAirportType:    string;
    PickUpHotelType:      string;
    PickUpAirportPhone:   string;
    PickUpHotelPhone:     string;
    Rest:                 string;
    PickUpAirportStr:     string;
    PickUpHotelStr:       string;
    BookingReferenceName: string;
    PhantomHotel:         boolean;
}

export interface ECrewFlight {
    originalDutyId: string;
    dutyDetails:    DutyDetail[];
}

export interface DutyDetail {
    FlightNumber:            string;
    AcType:                  string;
    Registration:            string;
    Gate:                    string;
    Stand:                   string;
    ExpPax:                  string;
    ExpPaxType:              number;
    PaxLoad:                 string;
    BlockTime:               string;
    Distance:                string;
    PaxType:                 number;
    FlightMemos:             any[];
    CrewOnFlight:            CrewOnFlight[];
    IsDeadhead:              boolean;
    DHDcode:                 DhDcode;
    CRoute:                  number;
    Delay:                   string;
    ServiceTypeCode:         string;
    ServiceTypeDesc:         string;
    CarrierDescription:      string;
    PaxLocator:              string;
    ContactName:             string;
    ContactTel:              string;
    ContactEmail:            string;
    ContactDepartment:       string;
    MELInfo:                 null;
    MealIndicator:           string;
    MealDescription:         string;
    DutyType:                number;
    Date:                    string;
    StartDate:               string;
    AimsDate:                string;
    UTCAimsDate:             string;
    DBKeyDate:               string;
    DepStation:              string;
    DepStationDescription:   string;
    ArrStation:              string;
    ArrStationDescription:   string;
    StartTime:               string;
    EndTime:                 string;
    LegStartTime:            string;
    LegEndTime:              string;
    PerLegStartTime:         string;
    PerLegEndTime:           string;
    DepLongitude:            number;
    DepLatitude:             number;
    ArrLongitude:            number;
    ArrLatitude:             number;
    Std:                     string;
    Sta:                     string;
    Atd:                     string;
    Ata:                     string;
    TrnReportTime:           string;
    TrnDebriefTime:          string;
    DepTimeMode:             number;
    ArrTimeMode:             number;
    TrainingCode:            string;
    TrainingCodeDescription: string;
    CourseName:              string;
    CourseComponent:         string;
    CourseDate:              string;
    DayMemo:                 Memo;
    CrewRouteMemo:           Memo;
    CrewLegMemo:             Memo;
    SelectedIndex:           number;
}

export interface Memo {
    Item1: MemoType;
    Item2: string;
}

export type MemoType = "Crew Leg Memo" | "Crew Route Memo" | "Day Memo";

export interface CrewOnFlight {
    ID:               string;
    Name:             string;
    ShortName:        string;
    Initials:         string;
    PosQual:          PosQual;
    AcQual:           string;
    BaseQual:         BaseQual;
    Sex:              string;
    DutyType:         string;
    CrewIsHidden:     boolean;
    Pic:              Pic;
    CheckedIn:        boolean;
    Indicators:       string;
    DataConfidential: number;
    Pax:              DhDcode;
    Nationality:      string;
    MaxFDP:           string;
    ActualFDP:        string;
    LineTrainingInfo: string;
    CrewPhoto:        string;
    CrewRouteLangs:   string;
    Contact:          Contact;
    CrewSeniority:    string;
    CourseName:       string;
    CourseComponent:  string;
    STRoute:          string;
    Categories:       string;
}

// export type BaseQual = "BRS" | "AMS";
export type BaseQual = string;

export interface Contact {
    Phone:               string;
    PhoneCanSendMessage: boolean;
    Address:             string;
    Email:               string;
}

export type DhDcode = "PAX" | string;

export type Pic = "" | "PIC";

export type PosQual = "FO" | "CP" | "PU" | "FA";

export type Color = "#8BC34A" | "#2196F3" | "#00BCD4" | "#000099" | "#FF9800" | "#9C27B0";

// export type Location = "BRS " | "LGW ";
export type Location = string;

// export type Resource = "A";
export type Resource = string;

// export type Sort = "[4]" | "[1]" | "[2]" | "[3]";
export type Sort = string;

export type Type = "Off" | "Flight" | "Standby" | "Default" | "Hotel" | "Training";

//----------------------------------------
//+++++++
// CONFIG
//+++++++

//DISRUPTIVE SCHEDULE settings as per 7.1.2.7 
export const EARLY_START_BEGIN_HHMM = '05:00';
export const EARLY_START_END_HHMM = '06:59';

export const LATE_FINISH_BEGIN_HHMM = '23:00';
export const LATE_FINISH_END_HHMM = '01:59';

export const NIGHT_DUTY_BEGIN_HHMM = '02:00';
export const NIGHT_DUTY_END_HHMM = '04:59';

//EASY JET FATIGUE MGT settings as per 7.4 
// easyJet Early Start 7.4.2.4
export const EZY_EARLY_START_BEGIN_HHMM = '02:00';
export const EZY_EARLY_START_END_HHMM = '06:59';

// easyJet Late Finish 7.4.2.5
export const EZY_LATE_FINISH_BEGIN_HHMM = '01:00';
export const EZY_LATE_FINISH_END_HHMM = '01:59';

// easyJet Disruptive Duty 7.4.2.6
export const EZY_DISRUPTIVE_BEGIN_HHMM = '01:00';
export const EZY_DISRUPTIVE_END_HHMM = '06:59';

// easyJet Night Finish 7.4.2.7
export const EZY_NIGHT_FINISH_BEGIN_HHMM = '02:00';
export const EZY_NIGHT_FINISH_END_HHMM = '04:59';

// easyJet Morning Duty 7.4.2.8
export const MORN_DUTY_START_BEGIN_HHMM = '00:00';
export const MORN_DUTY_START_END_HHMM = '09:29';
export const MORN_DUTY_END_HHMM = '17:59';

// easyJet Evening Duty 7.4.2.9
export const EVE_DUTY_BEGIN_HHMM = '09:30';
export const EVE_DUTY_END_HHMM = '18:00';

// easyJet Dual Duty 7.4.2.10
export const DUAL_DUTY_START_BEGIN_HHMM = '00:00';
export const DUAL_DUTY_START_END_HHMM = '09:29';
export const DUAL_DUTY_END_HHMM = '18:00';

// easyJet Neutral Duty 7.4.2.11
export const NEUTRAL_DUTY_BEGIN_HHMM = '09:30';
export const NEUTRAL_DUTY_END_HHMM = '17:59';



//TOTAL DUTY TIME 
//FTL Scheme settings as per 7.1.6.1
export const SEVEN_DAY_TOTAL_DUTY_HHMM = '60:00';
export const FOURTEEN_DAY_TOTAL_DUTY_HHMM = '110:00';
export const TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM = '190:00';
//FRM Scheme (roster B) settings as per 7.4.10.3
// ! same as FTL, if this changed code change req'd
// ! export const RB_SEVEN_DAY_TOTAL_DUTY_HHMM = '60:00';
export const RB_FOURTEEN_DAY_TOTAL_DUTY_HHMM = '100:00';
// ! export const RB_TWENTY_EIGHT_DAY_TOTAL_DUTY_HHMM = '190:00';
export const RB_TWELVE_WEEKS_TOTAL_DUTY_HHMM = '480:00';
export const RB_TWELVE_MONTHS_TOTAL_DUTY_HHMM = '1880:00';

//TOTAL FLIGHT TIME 
//FTL Scheme ettings as per 7.1.6.2
export const TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM = '100:00';
export const YEAR_TOTAL_FLIGHT_HHMM = '900:00';
export const TWELVE_MONTH_TOTAL_FLIGHT_HHMM = '1000:00';
//FRM Scheme (roster B) settings as per 7.4.10.3
// ! same as FTL, if this changed code change req'd
// ! export const RB_TWENTY_EIGHT_DAY_TOTAL_FLIGHT_HHMM = '100:00';
export const RB_TWELVE_WEEKS_TOTAL_FLIGHT_HHMM = '270:00';
export const RB_SIX_MONTHS_TOTAL_FLIGHT_HHMM = '550:00';
export const RB_NINE_MONTHS_TOTAL_FLIGHT_HHMM = '750:00';
export const RB_TWELVE_MONTHS_TOTAL_FLIGHT_HHMM = '900:00';


//MANAGING WAKEFULNESS settings as per 7.1.9.4
export const HOTEL_ELIGIBILITY_HHMM = '14:00';

//MINIMUM REST PERIOD settings as per 7.11.1
export const MINIMUM_REST_PERIOD_HHMM = '12:00';
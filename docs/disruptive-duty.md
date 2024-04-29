# Disruptive Duty  
the following table:
  
OMA:
| Time Period | Disruptive? | Duty Type | 
|----------|----------|----------|
| 05:00 - 06:59 | <p style="text-align: center;">Y</p> | Early Start |
| 07:00 - 22:59 | <p style="text-align: center;">N</p>||
| 23:00 - 01:59 | <p style="text-align: center;">Y</p> | Late Finish | 
| 02:00 - 04:59 | <p style="text-align: center;">Y</p> | Night Duty | 
   
  
  
  
EEASY JET FATIGUE MGT:  
| Time Period | Disruptive? | Duty Type | 
|----------|----------|----------|
| 02:00 - 04:59 | <p style="text-align: center;">Y</p> | Early Start/Night Finish |  
| 05:00 - 06:59 | <p style="text-align: center;">Y</p> | Early Start |
| 07:00 - 22:59 | <p style="text-align: center;">N</p>||  
| 09:00 - 22:59 | <p style="text-align: center;">N</p>||
| 01:00 - 01:59 | <p style="text-align: center;">Y</p> | Late Finish |  


/EASY JET FATIGUE MGT settings as per 7.4 


// easyJet Late Finish 7.4.2.5


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
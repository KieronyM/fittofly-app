# NOTIFICATIONS

* 1. do we want 2 notifications pages one for the day and one a summary for a block of time?
  2. should the rule ref and details be held in a differnt page tp keep this clean?  
* 


#### ⌛ Max FDP Exceeded
*Ref OMA 7.1.5.4.1 Basic Max FDP for acclimitised crew member without the use of extensions.*   
query = all maxFDPExceeded objects for date(s)    

[dutyPeriod.reportTime]   
Basic Max FDP: [maxFDPExceeded.maxFDPHHMM]   
Duty Period FDP: [maxFDPExceeded.flightDutyPeriodHHMM]


---
#### 🛌 Insufficent Rest Period between Duties  
*Ref OMA 7.1.11.1 minimum rest period of 12 hours or duration of previous duty if longer.*  
query = all restPeriodShort objects for date(s)    

[dutyPeriod.reportTime]     
Earliest Report: [restPeriodShort.earliestDPStartTime]   
Actual Report:   [dutyPeriod.reportTime]



---
#### 🏨 Eligible for Hotel 
*Ref OMA 7.1.9.4  Managing 18 hours of Wakefulness.*   
query = is dutyPeriod.isEligibleForHotel true  

[dutyPeriod.reportTime]     
Duty eligible for hotel 

---
#### 🗓️ Cumulative Time Limits Exceeded 
*Ref 7.1.6 for FTl rules [totalTimeExceeded.scheme = 'FTL']*  
*Ref 7.4.10.3 Roster B/FRM scheme* [totalTimeExceeded.scheme = 'FRM']*  
query = is dutyPeriod.reportTime or dutyPeriod.debriefTime within cumulativeHoursExceeded.startTime and cumulativeHoursExceeded.endTime
 
The [totalTimeExceeded.dutyType] period for [totalTimeExceeded.startDate] to [totalTimeExceeded.endDate]
is in excess the [totalTimeExceeded.scheme] " " [totalTimeExceeded.rule] rule  
E.g duty period for 22/01/2024 t0 22/05/2024 is in excess of the FTL 12 week duty total rule.



---
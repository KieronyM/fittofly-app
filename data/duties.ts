// types
import { duty } from "@types";

export const upcomingDuties: duty[] = [
    {
      dutyPeriodID: 0,
      dutyID: 3,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'MAH',
      reportTime: '2023-09-07T10:45:00Z',
      startTime: '2023-09-07T12:14:00Z',
      endTime: '2023-09-07T14:38:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 4,
      dutyType: 'Flight',
      origin: 'MAH',
      destination: 'LGW',
      startTime: '2023-09-07T15:51:00Z',
      endTime: '2023-09-07T18:14:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 5,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'BFS',
      startTime: '2023-09-07T19:45:00Z',
      endTime: '2023-09-07T21:15:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 6,
      dutyType: 'Flight',
      origin: 'BFS',
      destination: 'LGW',
      debriefingTime: '2023-09-07T23:36:00Z',
      startTime: '2023-09-07T21:45:00Z',
      endTime: '2023-09-07T22:59:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 8,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'PSA',
      reportTime: '2023-09-08T15:40:00Z', //HF added this line but loaded without a reporting time?
      startTime: '2023-09-08T16:40:00Z',
      endTime: '2023-09-08T18:50:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 9,
      dutyType: 'Flight',
      origin: 'PSA',
      destination: 'LGW',
      debriefingTime: '2023-09-08T22:20:00Z',
      startTime: '2023-09-08T19:35:00Z',
      endTime: '2023-09-08T21:50:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 10,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'RAK',
      reportTime: '2023-09-09T15:40:00Z',
      startTime: '2023-09-09T16:40:00Z',
      endTime: '2023-09-09T20:20:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 11,
      dutyType: 'Flight',
      origin: 'RAK',
      destination: 'LGW',
      debriefingTime: '2023-09-10T01:10:00Z',
      startTime: '2023-09-09T21:10:00Z',
      endTime: '2023-09-10T00:40:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 12,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'BCN',
      reportTime: '2023-09-10T14:45:00Z',
      startTime: '2023-09-10T15:45:00Z',
      endTime: '2023-09-10T17:55:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 13,
      dutyType: 'Flight',
      origin: 'BCN',
      destination: 'LGW',
      debriefingTime: '2023-09-10T21:25:00Z',
      startTime: '2023-09-10T18:30:00Z',
      endTime: '2023-09-10T20:55:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 17,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'KRK',
      reportTime: '2023-09-14T15:25:00Z',
      startTime: '2023-09-14T16:25:00Z',
      endTime: '2023-09-14T18:55:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 18,
      dutyType: 'Flight',
      origin: 'KRK',
      destination: 'LGW',
      debriefingTime: '2023-09-14T22:35:00Z',
      startTime: '2023-09-14T19:30:00Z',
      endTime: '2023-09-14T22:05:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 19,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'BFS',
      reportTime: '2023-09-15T12:20:00Z',
      startTime: '2023-09-15T13:20:00Z',
      endTime: '2023-09-15T14:55:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 20,
      dutyType: 'Flight',
      origin: 'BFS',
      destination: 'LGW',
      startTime: '2023-09-15T15:25:00Z',
      endTime: '2023-09-15T16:50:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 21,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'PRG',
      startTime: '2023-09-15T17:25:00Z',
      endTime: '2023-09-15T19:25:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 22,
      dutyType: 'Flight',
      origin: 'PRG',
      destination: 'LGW',
      debriefingTime: '2023-09-15T22:30:00Z',
      startTime: '2023-09-15T19:55:00Z',
      endTime: '2023-09-15T22:00:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 29,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'EDI',
      reportTime: '2023-09-22T11:40:00Z',
      startTime: '2023-09-22T12:40:00Z',
      endTime: '2023-09-22T14:10:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 30,
      dutyType: 'Flight',
      origin: 'EDI',
      destination: 'LGW',
      startTime: '2023-09-22T14:40:00Z',
      endTime: '2023-09-22T16:15:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 31,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'PMI',
      startTime: '2023-09-22T16:55:00Z',
      endTime: '2023-09-22T19:15:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 32,
      dutyType: 'Flight',
      origin: 'PMI',
      destination: 'LGW',
      debriefingTime: '2023-09-22T22:55:00Z',
      startTime: '2023-09-22T19:55:00Z',
      endTime: '2023-09-22T22:25:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 36,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'FAO',
      reportTime: '2023-09-26T14:25:00Z',
      startTime: '2023-09-26T15:25:00Z',
      endTime: '2023-09-26T18:15:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 37,
      dutyType: 'Flight',
      origin: 'FAO',
      destination: 'LGW',
      debriefingTime: '2023-09-26T22:00:00Z',
      startTime: '2023-09-26T18:45:00Z',
      endTime: '2023-09-26T21:30:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 38,
      dutyType: 'Flight',
      origin: 'LGW',
      destination: 'CPH',
      reportTime: '2023-09-27T08:40:00Z',
      startTime: '2023-09-27T09:40:00Z',
      endTime: '2023-09-27T18:35:00Z'
    },
    {
      dutyPeriodID: 0,
      dutyID: 39,
      dutyType: 'Flight',
      origin: 'CPH',
      destination: 'LGW',
      debriefingTime: '2023-09-28T21:40:00Z',
      startTime: '2023-09-27T19:05:00Z',
      endTime: '2023-09-27T21:10:00Z'
    }
  ];
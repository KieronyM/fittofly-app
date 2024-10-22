// import { importRoster } from '@/lib/roster/importRoster'; // Adjust the import path as needed
import { eCrewDutiesDetails, eCrewFlightsDetails } from '@/data/testing/source/eCrew';
import { findEarliestStartAndLatestEnd } from '@/utils/times';

describe('Generate new roster', () => {   
    it('Calculates start date correctly', async () => {
      // @ts-ignore
      const { formattedStartDate, formattedEndDate } = findEarliestStartAndLatestEnd(eCrewDutiesDetails);
  
      // Assertions
      expect(formattedStartDate).toEqual('2024-10-22');
      expect(formattedEndDate).toEqual('2024-11-30');
    });
  });
import {Unit} from './unit';

export class SortingMeta {
  unit: Unit;
  value: any;
}

export namespace SortingMeta {
  export enum SortingMetaKey {
    unitNumber = <any>'Unit #', // Unit.unitNumber
    floorPlanName = <any>'Floor Plan Name', // Unit.floorPlanName
    rankChange = <any>'Rank Change', // Unit.rankChange  todo check from CSV
    leaseRent = <any>'Lease Rent', // Unit.leaseRentCurrentLease
    lengthOfStay = <any>'Length Of Stay', // Unit.lengthOfStay
    DTM = <any>'DTM', // (Lease Rent / Market Rent) - 1
    timeToExpiration = <any>'Time to Expiration', // Lease End Date Current Lease - Report Date
    futureDTM = <any>'Future DTM', // (Lease Rent Future Lease / Market Rent) - 1
    daysVacant = <any>'Days Vacant', // Unit.daysVacant todo check from CSV
    makeReadyDateFutureLease = <any>'Make Ready Date Future Lease', // Unit.makeReadyDateFutureLease
    daysToMoveIn = <any>'Days to Move In', // Lease Start Date Future Lease - Report Date
    noticeDays = <any>'Notice Days', // Notice On Date Current Lease - Report Date
    daysLeft = <any>'Days Left', // Notice For Days Current Lease - Report Date
    daysToMI = <any>'Days to MI', // Least Start Date Future Lease - Report Date
  }
}

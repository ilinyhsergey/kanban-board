import {Collection} from './collection';
import {UnitTask} from './unit-task';
import {UnitComment} from './unit-comment';

export class Unit {
  isUnit: boolean;
  description?: string;
  collapsed?: boolean;
  systemTasksStatus: Collection<boolean>;
  userTasksStatus: Collection<boolean>;
  userTasks: UnitTask[];
  comments: UnitComment[];
  rankChange?: number;
  daysVacant?: number;

  reportDate?: string;
  propertyName?: string;
  unitNumber?: number;
  beds?: number;
  baths?: number;
  floorPlanName?: string;
  squareFeet?: number;
  unitStatus?: string;
  totalMarketRent?: number;
  leaseTypeCurrentLease?: string;
  leaseTermCurrentLease?: number;
  leaseEndDateCurrentLease?: string;
  noticeOnDateCurrentLease?: string;
  noticeForDateCurrentLease?: string;
  leaseRentCurrentLease?: number;
  mTMFeesCurrentLease?: number;
  lengthOfStay?: number;
  occupancyStatus?: string;
  renewalStatus?: string;
  leaseTypeFutureLease?: string;
  leaseStartDateFutureLease?: string;
  leaseEndDateFutureLease?: string;
  moveInDateFutureLease?: string;
  leaseRentFutureLease?: number;
  makeReadyDateFutureLease?: string;

  constructor() {
    this.isUnit = true;
    this.collapsed = true;
    this.systemTasksStatus = {};
    this.userTasksStatus = {};
    // this.userTasks = []; // todo use it
    this.userTasks = [
      {id: 0, name: 'User task 0'},
      {id: 1, name: 'User task 1'},
      {id: 2, name: 'User task 2'},
    ]; // todo just for initialisation
    // this.comments = []; // todo use it
    this.comments = [
      {comment: 'comment 2', dateTime: '2018-01-29 12:00:02'},
      {comment: 'comment 3', dateTime: '2018-01-29 12:00:03'},
      {comment: 'comment 1', dateTime: '2018-01-29 12:00:01'},
    ]; // todo just for initialisation
    this.rankChange = Math.floor(Math.random() * Math.floor(11) - 5);
  }
}

export namespace Unit {
  export enum UnitProps {
    reportDate = <any>'Report Date',
    propertyName = <any>'Property Name',
    unitNumber = <any>'Unit Number',
    beds = <any>'Beds',
    baths = <any>'Baths',
    floorPlanName = <any>'Floor Plan Name',
    squareFeet = <any>'Square Feet',
    unitStatus = <any>'Unit Status',
    totalMarketRent = <any>'Total Market Rent',
    leaseTypeCurrentLease = <any>'Lease Type Current Lease',
    leaseTermCurrentLease = <any>'Lease Term Current Lease',
    leaseEndDateCurrentLease = <any>'Lease End Date Current Lease',
    noticeOnDateCurrentLease = <any>'Notice On Date Current Lease',
    noticeForDateCurrentLease = <any>'Notice For Date Current Lease',
    leaseRentCurrentLease = <any>'Lease Rent Current Lease',
    mTMFeesCurrentLease = <any>'MTMFees Current Lease',
    lengthOfStay = <any>'Length Of Stay',
    occupancyStatus = <any>'Occupancy Status',
    renewalStatus = <any>'Renewal Status',
    leaseTypeFutureLease = <any>'Lease Type Future Lease',
    leaseStartDateFutureLease = <any>'Lease Start Date Future Lease',
    leaseEndDateFutureLease = <any>'Lease End Date Future Lease',
    moveInDateFutureLease = <any>'Move In Date Future Lease',
    leaseRentFutureLease = <any>'Lease Rent Future Lease',
    makeReadyDateFutureLease = <any>'Make Ready Date Future Lease',
    rankChange = <any>'Rank Change', // todo check from CSV
    daysVacant = <any>'Days Vacant', // todo check from CSV
  }

  export const allUnitProps: any[] = [
    UnitProps.reportDate,
    UnitProps.propertyName,
    UnitProps.unitNumber,
    UnitProps.beds,
    UnitProps.baths,
    UnitProps.floorPlanName,
    UnitProps.squareFeet,
    UnitProps.unitStatus,
    UnitProps.totalMarketRent,
    UnitProps.leaseTypeCurrentLease,
    UnitProps.leaseTermCurrentLease,
    UnitProps.leaseEndDateCurrentLease,
    UnitProps.noticeOnDateCurrentLease,
    UnitProps.noticeForDateCurrentLease,
    UnitProps.leaseRentCurrentLease,
    UnitProps.mTMFeesCurrentLease,
    UnitProps.lengthOfStay,
    UnitProps.occupancyStatus,
    UnitProps.renewalStatus,
    UnitProps.leaseTypeFutureLease,
    UnitProps.leaseStartDateFutureLease,
    UnitProps.leaseEndDateFutureLease,
    UnitProps.moveInDateFutureLease,
    UnitProps.leaseRentFutureLease,
    UnitProps.makeReadyDateFutureLease,
    UnitProps.rankChange,
    UnitProps.daysVacant,
  ];
}

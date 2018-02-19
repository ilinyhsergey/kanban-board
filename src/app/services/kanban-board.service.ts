import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {Moment} from 'moment';

import {KanbanColumn} from '../model/kanban-column';
import {Collection} from '../model/collection';
import {Unit} from '../model/unit';
import {OccupancyStatus} from '../model/occupancy-status.enum';
import {RenewalStatus} from '../model/renewal-status.enum';
import UnitProps = Unit.UnitProps;
import KanbanColumnNames = KanbanColumn.KanbanColumnNames;
import {SortingMeta} from '../model/sorting-meta';
import SortingMetaKey = SortingMeta.SortingMetaKey;
import {UtilsService} from './utils.service';

@Injectable()
export class KanbanBoardService {

  private columnKey2SortingMetaKeys: Collection<SortingMetaKey[]> = {};

  constructor(private utilsService: UtilsService) {
    this.initSortingMetaKeysForColumns();
  }

  makeKanbanColumns(units: Unit[]): KanbanColumn[] {
    let name2Column: Collection<KanbanColumn> = KanbanColumn.allKanbanColumnNames
      .reduce((res: Collection<KanbanColumn>, name: string, id: number): Collection<KanbanColumn> => {
        res[name] = {
          isColumn: true,
          name: name,
          descriptionUnitKeys: [
            UnitProps[UnitProps.unitNumber],
            UnitProps[UnitProps.beds],
            UnitProps[UnitProps.baths],
            UnitProps[UnitProps.floorPlanName],
          ],
          units: [],
          color: this.makeRandomColor(),
        } as KanbanColumn;
        return res;
      }, {});

    name2Column = units.reduce((res: Collection<KanbanColumn>, unit: Unit, id: number): Collection<KanbanColumn> => {
      let column: KanbanColumn;

      if (unit.occupancyStatus === OccupancyStatus.OC && unit.renewalStatus === RenewalStatus.undecided) {
        column = res[KanbanColumnNames.undecided];
      } else if (unit.occupancyStatus === OccupancyStatus.OC && unit.renewalStatus === RenewalStatus.renewed) {
        column = res[KanbanColumnNames.renewed];
      } else if (unit.occupancyStatus === OccupancyStatus.vacantAvailable && !unit.makeReadyDateFutureLease) {
        column = res[KanbanColumnNames.vacantAvailableMadeReady];
      } else if (unit.occupancyStatus === OccupancyStatus.vacantAvailable && !!unit.makeReadyDateFutureLease) {
        column = res[KanbanColumnNames.vacantAvailableNotReady];
      } else if (unit.occupancyStatus === OccupancyStatus.vacantLeased) {
        column = res[KanbanColumnNames.vacantLeased];
      } else if (unit.occupancyStatus === OccupancyStatus.noticeAvailable) {
        column = res[KanbanColumnNames.noticeAvailable];
      } else if (unit.occupancyStatus === OccupancyStatus.noticeLeased) {
        column = res[KanbanColumnNames.noticeLeased];
      }

      if (column) {
        column.units.push(unit);
      }

      return res;
    }, name2Column);
    return _.map(name2Column, column => column);
  }

  makeRandomColor(): string {
    return '#' + [null, null, null]
      .map(() => Math.floor((Math.random() * 255)).toString(16))
      .join('');
  }

  getUnitDescription(unit: Unit, column: KanbanColumn): string {
    const unitKeys: string[] = column.descriptionUnitKeys;
    return unitKeys && unitKeys.reduce((descriptionParts: string[], unitKey: string): string[] => {
      const value = unit[unitKey] || '';
      descriptionParts.push(`${UnitProps[unitKey]}: ${value}`);
      return descriptionParts;
    }, []).join(',\n');
  }

  isColumnEvictionStartOrTransfer(column: KanbanColumn) {
    return column.name === ('' + KanbanColumnNames.evictionStart) || column.name === ('' + KanbanColumnNames.transfer);
  }

  insertItemIntoArray<T>(key: string, item: T, array: T[], dstItem?: T, insertAfter = false) {
    let position: number;
    if (dstItem && array.length) {
      const keyValue = dstItem[key];
      position = _.findIndex(array, (i: T) => i[key] === keyValue);
    } else {
      position = -1;
    }

    if (position < 0) {
      array.push(item);
    } else {
      if (insertAfter) {
        ++position;
      }
      array.splice(position, 0, item);
    }
  }

  changeItemPositionInArray<T>(key: string, array: T[], srcItem: T, dstItem?: T) {
    if (array.length === 0) {
      return;
    }
    const srcPos = this.findPosition(array, srcItem, key);
    if (srcPos < 0) {
      return;
    }
    const dstPos = dstItem
      ? this.findPosition(array, dstItem, key)
      : array.length - 1;

    if (srcPos < dstPos) {
      array.splice(dstPos + 1, 0, srcItem);
      array.splice(srcPos, 1);
    } else if (dstPos < srcPos) {
      array.splice(srcPos, 1);
      array.splice(dstPos, 0, srcItem);
    }

  }

  findPosition<T>(array: T[], item: T, key: string): number {
    const keyValue = item[key];
    return _.findIndex(array, (i: T) => i[key] === keyValue);
  }

  removeItemFromArray<T>(key: string, item: T, array: T[]) {
    const keyValue = item[key];
    const position = _.findIndex(array, (i: T) => i[key] === keyValue);
    if (position < 0) {
      throw new Error('Item not found in an array');
    }

    array.splice(position, 1);
  }

  sortUnitsInColumn(column: KanbanColumn, sortingMetaKey: string, directionAsc: boolean): KanbanColumn {
    const sortingMetas: SortingMeta[] = column.units.map((unit: Unit): SortingMeta => {
      return {
        unit: unit,
        value: this.getSortingMeta(unit, sortingMetaKey)
      };
    });

    if (directionAsc) {
      sortingMetas.sort((a: SortingMeta, b: SortingMeta): number => {
        if (a.value > b.value) {
          return 1;
        } else if (a.value < b.value) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      sortingMetas.sort((a: SortingMeta, b: SortingMeta): number => {
        if (a.value > b.value) {
          return -1;
        } else if (a.value < b.value) {
          return 1;
        } else {
          return 0;
        }
      });
    }


    column.units = sortingMetas.map((sortingMeta: SortingMeta) => sortingMeta.unit);

    return column;
  }

  private getSortingMeta(unit: Unit, sortingMetaKey: string): any {

    switch (SortingMetaKey[sortingMetaKey]) {
      case SortingMetaKey.unitNumber:
        return +unit.unitNumber;

      case SortingMetaKey.floorPlanName:
        return unit.floorPlanName;

      case SortingMetaKey.rankChange:
        return +unit.rankChange;

      case SortingMetaKey.leaseRent:
        return +unit.leaseRentCurrentLease;

      case SortingMetaKey.lengthOfStay:
        return +unit.lengthOfStay;

      case SortingMetaKey.DTM:
        return (+unit.leaseRentCurrentLease - unit.totalMarketRent) - 1;

      case SortingMetaKey.timeToExpiration:
        return this.getDiff(unit.leaseEndDateCurrentLease, unit.reportDate);

      case SortingMetaKey.futureDTM:
        return (+unit.leaseRentFutureLease - unit.totalMarketRent) - 1;

      case SortingMetaKey.daysVacant:
        return +unit.daysVacant;

      case SortingMetaKey.makeReadyDateFutureLease: {
        const dateByFormatStr = this.utilsService.getDateByFormatStr(unit.makeReadyDateFutureLease);
        return dateByFormatStr ? +dateByFormatStr.getTime() : 0;
      }

      case SortingMetaKey.daysToMoveIn:
        return this.getDiff(unit.leaseStartDateFutureLease, unit.reportDate);

      case SortingMetaKey.noticeDays:
        return this.getDiff(unit.noticeOnDateCurrentLease, unit.reportDate);

      case SortingMetaKey.daysLeft:
        return this.getDiff(unit.noticeForDateCurrentLease, unit.reportDate);

      case SortingMetaKey.daysToMI:
        return this.getDiff(unit.leaseStartDateFutureLease, unit.reportDate);

      default:
        return 0;

    }

  }

  private getDiff(dateTo: string, dateFrom: string): number {
    const momentTo: Moment = this.utilsService.getMomentByFormatStr(dateTo);
    const momentFrom: Moment = this.utilsService.getMomentByFormatStr(dateFrom);
    return +momentTo.diff(momentFrom, 'days');
  }

  getSortingMetaKeysForColumns(column: KanbanColumn): SortingMetaKey[] {
    const columnKey: string = KanbanColumnNames[column.name];
    const sortingMetaKeys: SortingMetaKey[] = this.columnKey2SortingMetaKeys[columnKey];
    return _.cloneDeep(sortingMetaKeys);
  }

  private initSortingMetaKeysForColumns(): void {
    const map: Collection<SortingMetaKey[]> = {};

    map[KanbanColumnNames[KanbanColumnNames.undecided]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.leaseRent,
      SortingMetaKey.lengthOfStay,
      SortingMetaKey.DTM,
      SortingMetaKey.timeToExpiration,
    ];
    map[KanbanColumnNames[KanbanColumnNames.renewed]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.futureDTM,
      SortingMetaKey.lengthOfStay,
    ];
    map[KanbanColumnNames[KanbanColumnNames.vacantAvailableMadeReady]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.daysVacant,
      SortingMetaKey.makeReadyDateFutureLease,
    ];
    map[KanbanColumnNames[KanbanColumnNames.vacantAvailableNotReady]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.daysVacant,
    ];
    map[KanbanColumnNames[KanbanColumnNames.vacantLeased]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.daysVacant,
      SortingMetaKey.futureDTM,
      SortingMetaKey.daysToMoveIn,
    ];
    map[KanbanColumnNames[KanbanColumnNames.noticeAvailable]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.noticeDays,
      SortingMetaKey.daysLeft,
    ];
    map[KanbanColumnNames[KanbanColumnNames.noticeLeased]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.noticeDays,
      SortingMetaKey.daysLeft,
      SortingMetaKey.futureDTM,
      SortingMetaKey.daysToMI,
    ];
    map[KanbanColumnNames[KanbanColumnNames.evictionStart]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.leaseRent,
    ];
    map[KanbanColumnNames[KanbanColumnNames.transfer]] = [
      SortingMetaKey.unitNumber,
      SortingMetaKey.floorPlanName,
      SortingMetaKey.rankChange,
      SortingMetaKey.leaseRent,
    ];

    this.columnKey2SortingMetaKeys = map;
  }
}

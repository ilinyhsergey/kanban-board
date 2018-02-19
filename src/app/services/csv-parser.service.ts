import {Injectable} from '@angular/core';

import {FileHolder} from '../model/file-holder';
import {Unit} from '../model/unit';
import UnitProps = Unit.UnitProps;

@Injectable()
export class CsvParserService {
  static rowSeparator = /\n/;
  static columnSeparator = ',';

  constructor() {
  }

  parseUnitsFromCsvData(fileHolder: FileHolder): Unit[] {
    const src: string = fileHolder.src;
    const srcRows: string[] = src.split(CsvParserService.rowSeparator);

    const rowsLength = srcRows.length;
    if (rowsLength < 2) {
      return [];
    }

    const headerRow: string = srcRows[0];
    const columns: string[] = headerRow.split(CsvParserService.columnSeparator);
    const unitKeys: string[] = columns.map((column: string) => this.getUnitKeyByName(column));
    const rows: string[] = srcRows.slice(1);

    return rows.map((row: string): Unit => {
      const unit: Unit = new Unit();
      const values: string[] = row.split(CsvParserService.columnSeparator);

      unitKeys.forEach((unitKey: string, colId: number) => {
        if (unitKey) {
          unit[unitKey] = values[colId];
        }
      });

      return unit;
    });
  }

  private getUnitKeyByName(name: string): string {
    return name && UnitProps[name.trim()];
  }

}

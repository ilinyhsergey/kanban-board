import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

@Injectable()
export class UtilsService {

  static dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  static dataDateFormat = 'DD.MM.YYYY';

  constructor() {
  }

  hasClass(el: Element, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  addClass(el: Element, name: string) {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  removeClass(el: Element, name: string) {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  getMomentByFormatStr(dateTime: string, format: string = UtilsService.dataDateFormat): Moment {
    const m: Moment = moment(dateTime, format);
    return m.isValid() ? m : null;
  }

  getDateByFormatStr(dateTime: string, format: string = UtilsService.dataDateFormat): Date {
    const m: Moment = this.getMomentByFormatStr(dateTime, format);
    return m && m.toDate();
  }

  getFormatStrByDate(date: Date, format: string = UtilsService.dateTimeFormat): string {
    const m: Moment = moment(date);
    return m.isValid() ? m.format(format) : null;
  }

  downloadTextFile(filename: string, text: string) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

}

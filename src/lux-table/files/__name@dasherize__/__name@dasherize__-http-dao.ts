import { ILuxTableHttpDao } from '@ihk-gfi/lux-components';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export class <%= classify(name) %>HttpDao implements ILuxTableHttpDao {

    dataSource: any[] = [
    ]

    constructor() {
        for (let i = 0; i < 10; i++) {
            this.dataSource.push({label: 'ToDo', position: i});
        }
    }

    filter = '';
    data: any[] = [];
  
    loadData(conf: { page: number; pageSize: number; filter?: string; sort?: string; order?: string }): Observable<any> {
      // Beispiel; bis zum return würde das alles hier serverseitig stattfinden
      let tempDataSourceFix = this.dataSource.slice(0, this.dataSource.length);
      conf.pageSize = conf.pageSize ? conf.pageSize : tempDataSourceFix.length;
      conf.page = conf.page ? conf.page : 0;
      if (conf.filter) {
        conf.filter = conf.filter.toLocaleLowerCase();
        tempDataSourceFix = tempDataSourceFix.filter(
          (el: any) =>
            el.name.toLowerCase().indexOf(conf.filter) > -1 || el.symbol.toLowerCase().indexOf(conf.filter) > -1
        );
      }
  
      if (tempDataSourceFix.length > 0 && conf.sort && tempDataSourceFix[0][conf.sort]) {
        tempDataSourceFix = tempDataSourceFix.sort((a, b) => {
          if (conf.order === 'asc') {
            return a[conf.sort!] > b[conf.sort!] ? -1 : 1;
          } else if (conf.order === 'desc') {
            return b[conf.sort!] > a[conf.sort!] ? -1 : 1;
          }
          return 0;
        });
      }
  
      let currentPage = 0;
      if (this.isSameFilter(conf.filter)) {
        currentPage = Math.min(conf.page, Math.floor(tempDataSourceFix.length / conf.pageSize));
      }
      const start = currentPage * (conf.pageSize * 1);
      const end = start + conf.pageSize * 1;
      const result = tempDataSourceFix.slice(start, end);
      this.data = result;
      this.filter = conf.filter ?? '';
      return of({ items: result, totalCount: tempDataSourceFix.length }).pipe(delay(1000));
    }
  
    isSameFilter(newFilter: string | undefined): boolean {
      if (newFilter === undefined || newFilter === null) {
        newFilter = '';
      }
  
      return this.filter === newFilter;
    }
  }
  
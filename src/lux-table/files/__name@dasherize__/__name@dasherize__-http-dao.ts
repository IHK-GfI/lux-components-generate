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

    loadData(conf: { page: number, pageSize: number, filter?: string, sort?: string, order?: string }): Observable<any> {
        // nur ein gemocktes Beispiel
        // bis zum return wuerde das alles hier serverseitig stattfinden
        let start = conf.page * (conf.pageSize * 1);
        let end   = start + (conf.pageSize * 1);
  
        let tempDataSourceFix = this.dataSource.slice(0, this.dataSource.length);
        if (tempDataSourceFix[ 0 ][ conf.sort ]) {
          tempDataSourceFix = tempDataSourceFix.sort((a, b) => {
            if (conf.order === 'asc') {
              return a[ conf.sort ] - b[ conf.sort ];
            } else if (conf.order === 'desc') {
              return b[ conf.sort ] - a[ conf.sort ];
            }
            return 0;
          });
        }
  
        if (conf.filter) {
          conf.filter = conf.filter.toLocaleLowerCase();
          tempDataSourceFix = tempDataSourceFix.filter((el: any) =>
            ('' + el.position).indexOf(conf.filter) > -1 || el.name.toLowerCase().indexOf(conf.filter) > -1 ||
            ('' + el.weight).indexOf(conf.filter) > -1 || el.symbol.toLowerCase().indexOf(conf.filter) > -1);
        }
  
        let result = tempDataSourceFix.slice(start, end);
        return of({items: result, totalCount: tempDataSourceFix.length}).pipe(delay(2000));
      }
}

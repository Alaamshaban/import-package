import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'static-table',
  templateUrl: './static-table.component.html',
  styleUrls: ['./static-table.component.scss'],
})
export class StaticTableComponent implements OnInit {
  cols: string[] = [];
  @Input() data = Array<any>({});
  @Input() errorRowName: string | undefined;
  @Input() showToolTip = true;
  ngOnInit(): void {
    this.cols = this.data.length ? Object.keys(this.data[0]) : [];
  }
  getRowData(str: string) {
    if (String(str).length > 15 && this.showToolTip) return String(str).substring(0, 15) + ' ...'
    else return str;
  }

  checkLength(str: string) {
    return String(str).length > 15 && this.showToolTip;
  }
}

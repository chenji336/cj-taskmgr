import { Component, OnInit } from '@angular/core';

import { getDate } from 'date-fns';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  today = 'day';

  constructor() { }

  ngOnInit() {
    // getDay获取的是星期几而不是这个月的天数
    this.today = `day${getDate(new Date)}`;
  }

}

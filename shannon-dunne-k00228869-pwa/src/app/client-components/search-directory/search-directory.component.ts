import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-directory',
  templateUrl: './search-directory.component.html',
  styleUrls: ['./search-directory.component.css']
})
export class SearchDirectoryComponent implements OnInit {
  display = false;
  deal= false;
  onSearch()
  {
    this.display = true;
    // this.display = !this.display;
  }
  
  onDeal()
  {
    this.deal = true;
    // this.display = !this.display;
  }
  constructor() { }

  ngOnInit(): void {
  }



}

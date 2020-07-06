import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

<% if (createWithFilter == true) { %>  
  options = [
    {value: null, label: 'Kein Filter'},
    {value: 'A',  label: 'Filter A'},
    {value: 'B',  label: 'Filter B'},
    {value: 'C',  label: 'Filter C'},
  ];
<% } %>

  masterItems: any[] = [];
  masterIsLoading: boolean = false;
  masterSelected: any;

  constructor() {
    this.fillList();
  }

  ngOnInit() {

  }

  // $event entspricht dem selektierten Objekt aus der Masterliste
  loadDetail($event) {
    console.log('Detail geladen', $event);
  }

  loadFurtherEntries($event) {
    console.log('Scroll-Event des Infinite-Scrolls auf der Master-Liste', $event);
  }

  fillList() {
    for (let i = 0; i < 6; i++) {
      this.masterItems.push({
        id: this.masterItems.length,
        title: 'Eintrag #' + this.masterItems.length,
        subtitle: `Alle Informationen unter https://www.ihk-gfi.de`,
        icon: 'fa fa-cog',
        content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor inviduntutlaboreetdolore magna' +
                 'aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.'
      });
    }
  }

<% if (createWithFilter == true) { %>  
  changeFilter($event) {
    console.log('Filter ausgewählt', $event);
  }
<% } %>
}

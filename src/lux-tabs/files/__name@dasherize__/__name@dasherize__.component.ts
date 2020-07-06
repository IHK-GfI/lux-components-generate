import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  constructor() {

  }

  ngOnInit() {

  }

  activeTabChanged($event) {
    console.log('luxActiveTabChanged ', $event);
  }
}

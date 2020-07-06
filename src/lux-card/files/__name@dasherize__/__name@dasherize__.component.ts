import { Component, OnInit } from '@angular/core';

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {
  constructor() {}

  ngOnInit() {}

  onCardClicked() {
    console.log('Card clicked');
  }

<% if (typeOfCard != "simple") { %>  
  onExpandedChange() {
    console.log('Expanded change');
  }
<% } %>

<% if (createCardActions == true) { %>  
  onButtonClicked() {
    console.log('Button clicked');
  }
<% } %>
}

import { Component<% if (asyncData == false) { %>, OnInit<% } %> } from '@angular/core';
<% if (customCSSConfig == true) { %>import { ICustomCSSConfig } from '@ihk-gfi/lux-components';<% } %>
<% if (asyncData == true) { %>import { <%= classify(name) %>HttpDao } from './<%= dasherize(name) %>-http-dao';<% } %>

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component <% if (asyncData == false) { %>implements OnInit <% } %>{

<% if (asyncData == true) { %>
  httpDAO = null;
<% } else { %>
  dataSource: any[] = [];
<% } %>

<% if(customCSSConfig == true) { %>
  tableCSS: ICustomCSSConfig[] = [
    {
      class: 'demo-pos-until-3', check(element): boolean {
        return element.position < 3;
      }
    },
    {
      class: 'demo-pos-above-5', check(element): boolean {
        return element.position > 5;
      }
    }
  ];
<% } %>

  constructor() {
<% if (asyncData == true) { %>
    this.httpDAO = new <%= classify(name) %>HttpDao();
<% } %>
  }

  <% if (asyncData == false) { %>
    ngOnInit() {
      for (let i = 0; i < 10; i++) {
        this.dataSource.push({label: 'ToDo'});
      }
  }<% } %>

  <% if (multiSelect == true) { %>
    onSelectedChange($event) {
      console.log($event);
    }
    <% } %>

}

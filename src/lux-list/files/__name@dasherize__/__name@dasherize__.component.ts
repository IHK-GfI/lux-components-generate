import {Component} from '@angular/core';

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component {

  listItems: any[] = [];

  constructor() {<% if (emptyList == false) { %>
    this.fill(5);<% } %>
  }

<% if (emptyList == false) { %>  
  fill(amount: number) {
    for (let i = 0; i < amount; i++) {
      this.listItems.push({
        title: `Item #${i + 1}`,
        subTitle: `Untertitel Item #${i + 1}`,
        iconName: 'lux-interface-user-single',
        selected: false,
        value: 'Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore ' +
               'magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea' +
               'commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla' +
               'pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id' +
               'est laborum.'
      });
    }
  }
<% } %>

  click(clickedItem: any) {
    this.listItems.forEach((listItem: any) => listItem.selected = false);
    clickedItem.selected = true;

    console.log('luxClicked', clickedItem);
  }

}

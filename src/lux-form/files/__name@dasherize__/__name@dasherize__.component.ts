import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  form: FormGroup;<% if (formControls.find(control => control === "select")) { %>
  selectOptions = [ { label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }];<% } %><% if (formControls.find(control => control === "radio")) {%>
  radioOptions = [ { label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }];<% } %><% if (formControls.find(control => control === "chips")) {%>
  chipItems: string[] = [ 'Chip A', 'Chip B'];<% } %>

  constructor(private fb: FormBuilder) {
      this.form = this.fb.group({
          <%
          let rowItemCount;
          if (columnType =="single") { rowItemCount = 1;}
          else if (columnType =="dual") { rowItemCount = 2;}
          else { rowItemCount = 3; }
          %>
    <% for(let i = 0; i < formControls.length; i++) { %>
        <% for(let j = 0; j < rowItemCount; j++) { %>
                <%= formControls[i] %><%= j %>: [''],
            <% } %>
    <% } %>

    });
  }

  ngOnInit() {

  }
}

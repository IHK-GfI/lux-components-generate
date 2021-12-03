import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
<% if (navigationType == "inside") { %>import { ILuxStepperButtonConfig } from '@ihk-gfi/lux-components';<% } else { %>
import { LuxAppFooterButtonInfo, LuxAppFooterButtonService, LuxStepperHelperService } from '@ihk-gfi/lux-components';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
<% } %>

@Component({
  selector: '<%= shorthandSymbol %>-<%= dasherize(name) %>',<% if (createStylesheet) { %>
  styleUrls: ['./<%= dasherize(name) %>.component.scss'],<% } %>
  templateUrl: './<%= dasherize(name) %>.component.html',
})
export class <%= classify(name) %>Component <% if (navigationType == "outside") { %> implements OnDestroy<% }%> {
    
<% for (let i=1; i<=numberOfSteps; i++) { %>
    formGroup0<%= i %>: FormGroup;<% } %>

<% if (navigationType == "inside") { %>
    stepperPreviousButtonConfig: ILuxStepperButtonConfig = {
    label   : 'Zurück'
  };
     
  stepperNextButtonConfig: ILuxStepperButtonConfig = {
    label   : 'Weiter',
    color   : 'primary'
  };
     
  stepperFinishButtonConfig: ILuxStepperButtonConfig = {
    label: 'Speichern',
    iconName: 'fa-save',
    color   : 'primary'
  };
<% } else { %>
    btnPrev = LuxAppFooterButtonInfo.generateInfo({
      label: 'Zurück',
      cmd: 'previous',
      color: '',
      alwaysVisible: false,
      hidden: true,
      onClick: () => this.stepperService.previousStep()
    });
    btnNext = LuxAppFooterButtonInfo.generateInfo({
      label: 'Weiter',
      cmd: 'next',
      color: 'primary',
      alwaysVisible: true,
      hidden: false,
      onClick: () => this.stepperService.nextStep()
    });
    btnFin = LuxAppFooterButtonInfo.generateInfo({
      label: 'Abschließen',
      cmd: 'finish',
      color: 'primary',
      alwaysVisible: true,
      hidden: true,
      onClick: () => console.log('Gespeichert!')
    });
<% } %>

  constructor(private fb: FormBuilder<% if (navigationType == "outside") { %>, private buttonService: LuxAppFooterButtonService, private stepperService: LuxStepperHelperService<% } %>) {
<% for (let i=1; i<=numberOfSteps; i++) { %>
    this.formGroup0<%= i %> = this.fb.group({});
<% } %>
<% if (navigationType == "outside") { %>
      this.buttonService.buttonInfos = [this.btnPrev, this.btnNext, this.btnFin];
<% } %>
  }

<% if (navigationType == "outside") { %>
  ngOnDestroy() {
    this.buttonService.buttonInfos = [];
  }
       
  onStepChanged(event: StepperSelectionEvent) {
      if (event.selectedIndex === 0) {
        this.btnPrev.hidden = true;
        this.btnNext.hidden = false;
        this.btnFin.hidden = true;
      } <% if (numberOfSteps > 2) { %>else if (event.selectedIndex > 0 && event.selectedIndex < <%= numberOfSteps - 1 %>) {
        this.btnPrev.hidden = false;
        this.btnNext.hidden = false;
        this.btnFin.hidden = true;
      }<% } %> else {
        this.btnPrev.hidden = false;
        this.btnNext.hidden = true;
        this.btnFin.hidden = false;
      }
  }
<% } %>

  <% if (navigationType == "inside") { %>
   onSave(){
     console.log('Gespeichert!');
   }
    <% } %>
}

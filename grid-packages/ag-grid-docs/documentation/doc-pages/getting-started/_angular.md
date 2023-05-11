[[only-angular]]
|
| ### Quick Look Code Example
|
|<tabs>
|<div tab-label="app.component.ts">
|
| ```ts{numberLines: true}
| import { Component } from '@angular/core';
| import { ColDef } from 'ag-grid-community';
|
| @Component({
|   selector: 'app-root',
|   templateUrl: './app.component.html',
|   styleUrls: [ './app.component.scss' ]
| })
| export class AppComponent  {
|
|     columnDefs: ColDef[] = [
|         { field: 'make' },
|         { field: 'model' },
|         { field: 'price' }
|     ];
|
|     rowData = [
|         { make: 'Toyota', model: 'Celica', price: 35000 },
|         { make: 'Ford', model: 'Mondeo', price: 32000 },
|         { make: 'Porsche', model: 'Boxster', price: 72000 }
|     ];
|
| }
| ```
|
|</div>
|<div tab-label="app.component.html">
|
| ```html{numberLines: true}
| <ag-grid-angular
|     style="width: 500px; height: 350px;"
|     class="ag-theme-alpine"
|     [rowData]="rowData"
|     [columnDefs]="columnDefs">
| </ag-grid-angular>
| ```
|
|</div>
|<div tab-label="styles.scss">
|
| ```scss{numberLines: true}
| @import 'ag-grid-community/styles/ag-grid.css';
| @import 'ag-grid-community/styles/ag-theme-alpine.css';
| ```
|
|</div>
|
| <tabs-footer>
| <open-in-cta type="stackblitz" href="https://stackblitz.com/edit/ag-grid-angular-hello-world" />
| </tabs-footer>
|
|</tabs>
|
| [[note]]
| | Please refer to our [Compatibility Guide](/angular-compatibility/) for Supported Versions of
| | Angular & AG Grid.
|
| ## Getting Started with Community Video
|
| <video-section id="_cRDVM6NlPk" title="Video Tutorial for Getting Started with AG Grid Community">
| <p>
|     In this video we detail the steps to get an application working with Angular and AG Grid Community. We show how to set up Rows and Columns, set some Grid Properties, use the Grid's API and listen to Grid events.
| </p>
| </video-section>
| <br/>
| <br/>
|
| ## Getting Started with Enterprise Video
|
| <video-section id="xe6i3W6qW5k" title="Getting Started with AG Grid Enterprise">
| <p>
|     The video then follows showing how to get started with <a href="../licensing/">AG Grid Enterprise</a>. Please take a look at Enterprise, you don't need a license to trial AG Grid Enterprise, you only need to get in touch if you decide to use it in your project.
| </p>
| <br/>
| </video-section>
| <br/>
| <br/>
|
| ## Getting Started with AG Grid Community
|
| Below we provide code for a simple AG Grid Angular application. To get this working locally,
| create a new Angular application as follows:
|
| ```bash
| ng new my-app --style scss --routing false
| cd my-app
| npm install --save ag-grid-community
| npm install --save ag-grid-angular
| npm run start
| ```
|
| If everything goes well, `npm run start` has started the web server and conveniently opened a browser
| pointing to [localhost:4200](http://localhost:4200).
|
| <br/>
|
| ### Grid Dependencies
|
| Note the `package.json` has the following dependencies:
|
| ```jsx
|"dependencies": {
|    "ag-grid-community": "@AG_GRID_VERSION@",
|    "ag-grid-angular": "@AG_GRID_VERSION@",
|    ...
| ```
|
| `ag-grid-community` is the core logic of the Grid, and `ag-grid-angular` is the Angular Rendering Engine.
| Both are needed for the grid to work with Angular and their versions <b>must</b> match.
|
| <br/>
|
| ### Copy in Application Code
|
| Copy the content below into the file `app.modules.ts`:
|
|```js
|import { NgModule } from '@angular/core';
|import { BrowserModule } from '@angular/platform-browser';
|import { HttpClientModule } from '@angular/common/http'
|import { AgGridModule } from 'ag-grid-angular';
|import { AppComponent } from './app.component';
|
|@NgModule({
|  declarations: [
|    AppComponent
|  ],
|  imports: [
|    BrowserModule,
|    HttpClientModule,
|    AgGridModule
|  ],
|  providers: [],
|  bootstrap: [AppComponent]
|})
|export class AppModule { }
|
|```
|
| Copy the content below into the file `app.component.ts`:
|
|```js
|import { HttpClient } from '@angular/common/http';
|import { Component, ViewChild } from '@angular/core';
|import { AgGridAngular } from 'ag-grid-angular';
|import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
|import { Observable } from 'rxjs';
|
|@Component({
|  selector: 'app-root',
|  templateUrl: './app.component.html',
|  styleUrls: ['./app.component.scss']
|})
|export class AppComponent {
|
|  // Each Column Definition results in one Column.
|  public columnDefs: ColDef[] = [
|    { field: 'make'},
|    { field: 'model'},
|    { field: 'price' }
|  ];
|
|  // DefaultColDef sets props common to all Columns
|  public defaultColDef: ColDef = {
|    sortable: true,
|    filter: true,
|  };
|  
|  // Data that gets displayed in the grid
|  public rowData$!: Observable<any[]>;
|
|  // For accessing the Grid's API
|  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
|
|  constructor(private http: HttpClient) {}
|
|  // Example load data from server
|  onGridReady(params: GridReadyEvent) {
|    this.rowData$ = this.http
|      .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
|  }
|
|  // Example of consuming Grid Event
|  onCellClicked( e: CellClickedEvent): void {
|    console.log('cellClicked', e);
|  }
|
|  // Example using Grid's API
|  clearSelection(): void {
|    this.agGrid.api.deselectAll();
|  }
|}
|
|```
|
| Copy the content below into the file `app.component.html`:
|
|```js
|<!-- Button to clear selection -->
|<button (click)="clearSelection()">Clear Selection</button>
|<!-- AG Grid Angular Component -->
|<ag-grid-angular
|    style="width: 100%; height: 100%"
|    class="ag-theme-alpine"
|    [columnDefs]="columnDefs"
|    [defaultColDef]="defaultColDef"
|    [rowData]="rowData$ | async"
|    [rowSelection]="'multiple'"
|    [animateRows]="true"
|    (gridReady)="onGridReady($event)"
|    (cellClicked)="onCellClicked($event)"
|  ></ag-grid-angular>
|```
|
|
| Copy the content below into the file `styles.scss`:
|
|```css
|@import 'ag-grid-community/styles/ag-grid.css';
|@import 'ag-grid-community/styles/ag-theme-alpine.css';
|
|html, body {
|    height: 100%;
|    width: 100%;
|    padding: 5px;
|    box-sizing: border-box;
|    -webkit-overflow-scrolling: touch;
|}
|```
|
| If everything is correct, you should see a simple grid that looks like this:<br/><br/>
| ![AG Grid in its simplest form](resources/step1.png)
|
| We will now break this file down and explain the different parts...
|
| <br/>
|
| ### Grid Module
|
| The AG Grid Module was included inside the app.
|
|```css
| import { AgGridModule } from 'ag-grid-angular';
|
| ...
|
|  imports: [
|    BrowserModule,
|    HttpClientModule,
|    AgGridModule
|  ],
|
| ```
|
| This allows access to the AG Grid component throughout the application.
|
| ### Grid CSS and Themes
|
| Two CSS files were loaded as follows:
|
|```css
|@import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
|@import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS
| ```
|
| The first `ag-grid.css` is always needed. It's the core structural CSS needed by the grid. Without this, the Grid will not work.
|
| The second `ag-theme-alpine.css` is the chosen [Grid Theme](/themes/). This is then subsequently applied to the grid by applying the Theme's CSS Class to the grid element `class="ag-theme-alpine"`.
|
| You can select from any of the [Grid Provided Themes](/themes/). If you don't like the provided themes you can [Customise the Provided Theme](/themes/) or do not use a Theme and style the grid yourself from scratch.
|
| The dimension of the Grid is also set on the parent DIV via `style={{width: 500, height: 500}}`. The grid will fill 100% in both directions, so size it's parent element to the required dimensions.
|
| ```html
|<ag-grid-angular
|    style="width: 100%; height: 100%"
|    class="ag-theme-alpine"/>
| ```
| <br/>
|
| ### Setting Row Data
|
| The Grid is provided Row Data via the `rowData` Grid Property. This is wired up using an `Observable`.
|
| ```js
| // Data that gets displayed in the grid
| public rowData$!: Observable<any[]>;
| ...
|
| // Example load data from server
| onGridReady(params: GridReadyEvent) {
|   this.rowData$ = this.http
|     .get<any[]>('https://www.ag-grid.com/example-assets/row-data.json');
| }
|
| ...
|
|<ag-grid-angular
|    [rowData]="rowData$ | async"
|    ...
| ```
|
| <br/>
|
| ### Setting Column Definitions
|
| Columns are defined by setting [Column definitions](/column-definitions/). Each Column Definition
| defines one Column. Properties can be set for all Columns using the Default Column Definition.
|
| ```js
| // Each Column Definition results in one Column.
| public columnDefs: ColDef[] = [
|   { field: 'make'},
|   { field: 'model'},
|   { field: 'price' }
| ];
|
| // DefaultColDef sets props common to all Columns
| public defaultColDef: ColDef = {
|   sortable: true,
|   filter: true,
| };
|
|...
|
|<ag-grid-angular
|    [columnDefs]="columnDefs"
|    [defaultColDef]="defaultColDef"
|    ...
|/>
| ```
|
| <br/>
|
| ### Accessing the Grid's API
|
|```jsx
| // For accessing the Grid's API
| @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
| ...
| // Example using Grid's API
| clearSelection(): void {
|   this.agGrid.api.deselectAll();
| }
|```
|
| <br/>
|
| ### Consuming Grid Events
|
| Listen to [Grid Events](/grid-events/) by adding a callback to the appropriate `(eventName)` output property.
| This example demonstrates consuming the `cellClicked` event.
|
|```html
|<ag-grid-angular
|    (cellClicked)="onCellClicked($event)"
|    ...
|/>
|```
|
| <br/>
|
| ### Grid Properties
|
| Set other [Grid Options](/grid-options/) by adding parameters to `<ag-grid-angular/>` component.
| This example demonstrates setting `animateRows` and `rowSelection`.
|
|```jsx
|<ag-grid-angular
|    [rowSelection]="'multiple'"
|    [animateRows]="true"
|    ...
|/>
|```
|
| <br/>
| <br/>
|
| ## Getting Started with AG Grid Enterprise
|
| We would love for you to try out AG Grid Enterprise. There is no cost to trial.
| You only need to get in touch if you want to start using AG Grid Enterprise
| in a project intended for production.
|
| The following steps continues from above and installs AG Grid Enterprise.
|
| <br/>
|
| ### Install Dependency
|
| In addition to `ag-grid-community` and `ag-grid-angular`, AG Grid Enterprise also needs
| `ag-grid-enterprise`.
|
| ```bash
| npm install --save ag-grid-enterprise
| ```
|
| The `package.json` should now contain the following dependencies:
|
| ```jsx
|"dependencies": {
|    "ag-grid-community": "@AG_GRID_VERSION@",
|    "ag-grid-enterprise": "@AG_GRID_VERSION@",
|    "ag-grid-angular": "@AG_GRID_VERSION@",
|    ...
| ```
|
| `ag-grid-enterprise` contains the Enterprise features only, it does not contain the core grid,
| hence you still need `ag-grid-community` and `ag-grid-angular`. Versions of all three <b>must</b> match.
|
| <br/>
|
| ### Import Enterprise
|
| Import AG Grid Enterprise intro your application as follows:
|
|```js
|import 'ag-grid-enterprise';
|```
|
| And that is all, you use the same `<ag-grid-angular/>` component, except this time it comes installed
| with all the Enterprise features.
|
| For example, you can now Row Group (an Enterprise Feature) by a particular Column by
| setting `rowGroup=true` on the Column Definition.
|
|```jsx
| // Each Column Definition results in one Column.
| public columnDefs: ColDef[] = [
|   { field: 'make', rowGroup: true},
|   { field: 'model'},
|   { field: 'price' }
| ];
|```
|

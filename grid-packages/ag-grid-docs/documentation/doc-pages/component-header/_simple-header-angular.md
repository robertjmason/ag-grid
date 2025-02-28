<framework-specific-section frameworks="angular">
|Below is a simple example of header component:
</framework-specific-section>

<framework-specific-section frameworks="angular">
<snippet transform={false}>
|import {Component, ElementRef, ViewChild} from '@angular/core';
|import {IHeaderAngularComp} from 'ag-grid-angular'
|import {IHeaderParams} from 'ag-grid-community'
|
|@Component({
|    selector: 'app-custom-header',
|    template: `
|      &lt;div>
|          &lt;div *ngIf="params.enableMenu" #menuButton class="customHeaderMenuButton" (click)="onMenuClicked($event)">
|              &lt;i class="fa {{params.menuIcon}}">&lt;/i>
|          &lt;/div>
|          &lt;div class="customHeaderLabel">{{ params.displayName }}&lt;/div>
|          &lt;div *ngIf="params.enableSorting" (click)="onSortRequested('asc', $event)" [ngClass]="ascSort"
|              class="customSortDownLabel">
|              &lt;i class="fa fa-long-arrow-alt-down">&lt;/i>
|          &lt;/div>
|          &lt;div *ngIf="params.enableSorting" (click)="onSortRequested('desc', $event)" [ngClass]="descSort"
|              class="customSortUpLabel">
|              &lt;i class="fa fa-long-arrow-alt-up">&lt;/i>
|          &lt;/div>
|          &lt;div *ngIf="params.enableSorting" (click)="onSortRequested('', $event)" [ngClass]="noSort"
|              class="customSortRemoveLabel">
|              &lt;i class="fa fa-times">&lt;/i>
|          &lt;/div>
|      &lt;/div>
|    `,
|    styles: [
|        `
|            .customHeaderMenuButton,
|            .customHeaderLabel,
|            .customSortDownLabel,
|            .customSortUpLabel,
|            .customSortRemoveLabel {
|                float: left;
|                margin: 0 0 0 3px;
|            }
|
|            .customSortUpLabel {
|                margin: 0;
|            }
|
|            .customSortRemoveLabel {
|                font-size: 11px;
|            }
|
|            .active {
|                color: cornflowerblue;
|            }
|        `
|    ]
|})
|export class CustomHeader implements IHeaderAngularComp {
|    public params: IHeaderParams;
|
|    public ascSort: string;
|    public descSort: string;
|    public noSort: string;
|
|    @ViewChild('menuButton', {read: ElementRef}) public menuButton;
|
|    agInit(params: IHeaderParams): void {
|        this.params = params;
|
|        params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
|        
|        this.onSortChanged();
|    }
|
|    onMenuClicked() {
|        this.params.showColumnMenu(this.menuButton.nativeElement);
|    };
|
|    onSortChanged() {
|        this.ascSort = this.descSort = this.noSort = 'inactive';
|        if (this.params.column.isSortAscending()) {
|            this.ascSort = 'active';
|        } else if (this.params.column.isSortDescending()) {
|            this.descSort = 'active';
|        } else {
|            this.noSort = 'active';
|        }
|    }
|
|    onSortRequested(order: string, event: any) {
|        this.params.setSort(order, event.shiftKey);
|    }
|}
</snippet>
</framework-specific-section>
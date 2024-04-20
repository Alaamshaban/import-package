import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ImportPackageComponent } from './import-package.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ExportPackageModule } from '@khaznatech/export-package';
import { CommonModule } from '@angular/common';
import { StaticTableComponent } from './static-table/static-table.component';

const primNg = [
  ButtonModule,
  CalendarModule,
  CardModule,
  CheckboxModule,
  ConfirmPopupModule,
  ColorPickerModule,
  DialogModule,
  DropdownModule,
  FieldsetModule,
  FileUploadModule,
  ImageModule,
  InputNumberModule,
  InputMaskModule,
  InputSwitchModule,
  InputTextModule,
  InputTextareaModule,
  MenuModule,
  MenubarModule,
  MessageModule,
  PaginatorModule,
  ToastModule,
  ToolbarModule,
  TooltipModule,
  TableModule,
];

@NgModule({
  declarations: [
    ImportPackageComponent,
    StaticTableComponent
  ],
  imports: [
    ...primNg,
    ExportPackageModule,
    CommonModule
  ],
  exports: [
    ImportPackageComponent,
    ...primNg,
    CommonModule
  ],
  providers: [ImportPackageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImportPackageModule { }

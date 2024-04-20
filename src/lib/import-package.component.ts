/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-const */
import { OnInit, Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Optional, ViewChild } from '@angular/core';
import { IConfig, IvalidFile } from './IImportCenter';
import { FileUpload } from 'primeng/fileupload';
import { ExportPackageService } from '@khaznatech/export-package';
import { ValidateHeadersService } from './validate-headers.service';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ExportAction } from './models/export-action.model';
@Component({
  selector: 'khazna-import-package',
  templateUrl: './import-package.component.html',
  styleUrls: ['./import-package.component.scss'],
  providers: [MessageService]
})
export class ImportPackageComponent implements OnInit {
  @Input() cancelIcon = 'pi pi-times';
  @Input() importCenterConfig!: IConfig;
  @Input() showToolTip = true;
  @Input() IsReadyForImport = true;
  @Input() maxFileSize = 1000000;
  @Input() invalidMessages = {
    invalidFileTypeMessageSummary: 'You have to upload csv file type',
    invalidFileSizeMessageSummary: 'Exceed file size',
    invalidFileSizeMessageDetail: `max upload is ${this.maxFileSize / 1000000} mb`,
    invalidFileTypeMessageDetail: ''
  }
  @Input() exportActions: ExportAction[] = []
  @Input() validTypes = 'application/vnd.ms-excel, text/csv';
  @Input() filesNumber = 0;
  @Input() disableBrowse = true;
  @Input() currentFiles = 0;
  @Input() rejectedList = [];
  @Input() acceptedList = [];
  @Input() manualActionList = [];
  @Input() infoText!: string;
  @Input() sampleFileType = 'csv';
  @Input() uploadSectionsInputs = {
    selectFileLabel: 'Browse',
    uploadLabel: 'Import',
    dragText: 'Drag File Here',
    browseFileText: 'Browse',
    uploadIcon: 'pi pi-cloud-upload',
    sampleFileText: 'Download Sample File'
  };
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();
  @Output() onImport = new EventEmitter();
  @Output() onDownloadSample = new EventEmitter();
  @Input() onUpload: EventEmitter<any> = new EventEmitter<any>();
  fileTypes: any = {};
  showDragIcon = true;
  filesToUpload: IvalidFile[] = [];
  constructor(
    private exportPackage: ExportPackageService,
    private uploadCompressedService: ValidateHeadersService,
    @Optional() public importCenterDialogConfig: DynamicDialogConfig,
    @Optional() public importComponent: DynamicDialogRef,
    private messageService: MessageService
  ) {

  }
  ngOnInit() {
    this.prepareValidTypes();
    this.onError.subscribe(res => {
      if (res.invalidFileHeaders) this.clearSelectedFiles(res.uploader)
    })

    this.onUpload.subscribe(res => {
      if (res.onUpload) this.clearSelectedFiles(res.uploader)
    })
  }

  get isMultiple() {
    return this.importCenterConfig.file_config.length > 1
  }

  get hasRejectedRows() {
    return this.exportActions.find((action: any) => action.name === 'rejected')
  }

  onClickExportAction(action: ExportAction) {
    this.downloadAction(action)
  }

  downloadAction(action: ExportAction) {
    if (action.records.length) {
      const date = new Date();
      const today = date.toLocaleDateString('en-GB');
      this.exportPackage.exportData({ [action.name]: action.records }, action?.columns.length > 0 ? { [action.name]: action.columns } : {}, action.fileType, this.importCenterConfig.entity_name + '_' + action.name + '_' + today, []);
    } else this.onError.emit({ noFileToDownload: true })
  }

  onSelect(ev: any) {
    this.showDragIcon = !ev.currentFiles?.length;
    this.currentFiles = ev.currentFiles?.length;
    this.exportActions = []
  }

  onFileSelected(event: any, PT: FileUpload) {
    this.exportActions = []
    let file = event.target.files[0];
    this.currentFiles = event.target.files.length;
    this.filesNumber = this.disableBrowse ? this.importCenterConfig.file_config.length : 0;
    if (!this.validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'You have to upload csv file type',
        detail: ''
      });
      this.onError.emit({ invalidFileTypeError: true })
    } else if (file.size > this.maxFileSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Exceed file size',
        detail: `max upload is ${this.maxFileSize / 1000000} mg`
      });
      this.onError.emit({ maxFileSize: true })
    } else {
      this.showDragIcon = false;
      PT._files = [file];
    }
  }

  // //Download Sample File
  public downloadSampleFile() {
    if (this.importCenterConfig.headers.length) {
      let row: any = {};
      this.importCenterConfig.headers.forEach((s: any) => {
        row[s.label] = s.sample;
      });
      const date = new Date();
      const today = date.toLocaleDateString('en-GB');
      this.exportPackage.exportData({ sample: [row] }, {}, this.sampleFileType == 'csv' ? 'csv' : 'xlsx', this.importCenterConfig.entity_name + '_sample_' + today, [])
      this.onDownloadSample.next({ downloaded: true })
    }
  }

  //Get valid types array
  public prepareValidTypes() {
    let typesArr: any = [];
    this.importCenterConfig.file_config.forEach((file) => {
      typesArr.push(file.types);
      this.fileTypes[file.types.join(',')] = Array<File>();
    });
    this.validTypes = typesArr.join(',');
    this.filesNumber = this.disableBrowse ? this.importCenterConfig.file_config.length : 0;
  }

  async validateCSVHeaders() {
    const fileToValidate: File =
      this.fileTypes['application/vnd.ms-excel,text/csv'][0];
    const isFilesHeaderValid = await this.uploadCompressedService.checkHeaders(
      fileToValidate,
      this.importCenterConfig?.headers
    );
    return isFilesHeaderValid;
  }

  clearSelectedFiles(PT: FileUpload) {
    this.currentFiles = 0;
    this.prepareValidTypes();
    PT.fileLimit += this.filesNumber;
    this.filesToUpload = [];
  }

  onRemove(PT: FileUpload) {
    this.showDragIcon = true;
  }

  // //Import Actions
  public async upload(event: any, PT: FileUpload) {
    if (this.IsReadyForImport) {
      this.prepareForUpload(event.files);
      if (this.ISFilesCountValid()) {
        const ISFileHeadersValid = await this.validateCSVHeaders();
        if (ISFileHeadersValid) {
          this.uploadAllFiles(PT);
        } else {
          this.onError.emit({ invalidFileHeaders: true, uploader: PT })
        }
      } else {
        this.onError.emit({
          fileCountError: true, message: 'invalid file counts', uploader: PT
        })
      }
    } else {
      this.clearSelectedFiles(PT);
      this.onError.emit({ notReadyError: true })
    }
  }

  prepareForUpload(files: Array<File>) {
    let typeKeys = Object.keys(this.fileTypes);
    files.forEach((file) => {
      let fileType: any = typeKeys.find((key) => key.includes(file.type));
      let count = this.importCenterConfig.file_config.find(
        (config: any) => config?.types.join(',') == fileType
      )?.count;
      if (count && this.fileTypes[fileType].length < count) {
        this.fileTypes[fileType].push(file);
        this.setFileToUpload(file);
      } else {
        this.onError.emit({ exceededFileCountError: true })
      }
    });
  }

  public setFileToUpload(file: any) {
    let fileData: IvalidFile = {
      name: file.name,
      type: file.type,
      url: '',
      file: file,
    };
    this.filesToUpload.push(fileData);
  }

  // //Check if all files chosen
  public ISFilesCountValid(): boolean {
    return this.importCenterConfig?.file_config.every(
      (file: any) => file.count == this.fileTypes[file.types.join(',')].length
    );
  }

  // // Upload All Files and set their urls
  public uploadAllFiles(PT: FileUpload) {
    let notUploadedFiles = this.filesToUpload.filter(
      (element) => element.url == ''
    );
    if (notUploadedFiles.length > 0) {
      this.onImport.emit({
        notUploadedFiles: notUploadedFiles.map((element) => {
          let formData = new FormData();
          return { ...element, formData: formData.append('file', element.file), };
        })
        , uploader: PT
      });
    }
  }

}

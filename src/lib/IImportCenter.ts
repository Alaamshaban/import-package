export interface IImportCenter {
  importURL: string;
  downloadType: string;
  types_label: string;
  max_file_size: number;
}
export interface IConfig {
  entity_name: string;
  file_config: Array<IFileType>;
  headers: Array<header>;
  extras: any;
}

export interface IFileType {
  types: Array<string>;
  count: number;
}

export interface header {
  name: string;
  label: string;
  sample: string;
}

export interface IvalidFile {
  file: File;
  url: string;
  name: string;
  type: string;
}
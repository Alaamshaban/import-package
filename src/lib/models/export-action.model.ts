import { column } from "@khaznatech/export-package/lib/column.model";

export interface Label {
  name: string;
  label: string;
  isLabel: boolean;
  hasIcon: boolean;
}

export interface ExportAction extends Label {
  records: any[];
  fileType: string;
  columns: column[]
}

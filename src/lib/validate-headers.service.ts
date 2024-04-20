import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidateHeadersService {

  public async checkHeaders(file: File, dataHeaders: any) {
    const sampleHeaders: string[] = dataHeaders.map(
      (header: any) => header.label
    );
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    const fileReaderPromise = new Promise(
      (resolve) => (reader.onload = resolve)
    );
    const event = await fileReaderPromise;
    const csv = reader.result as string;
    const headers = csv.split('\n')[0].split(',');
    if (headers.length != sampleHeaders.length) return false;
    let valid = true;
    sampleHeaders.forEach((header) => {
      if (
        headers.findIndex(
          (fileHeader) =>
            fileHeader.trim().toLowerCase() == header.trim().toLowerCase()
        ) < 0
      ) {
        valid = valid && false;
      }
    });
    return valid;
  }
}

import { Component } from '@angular/core';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import { App } from '@capacitor/app';
import { DocumentScanner } from '@capacitor-mlkit/document-scanner';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  documentName: string | undefined;

  async ngOnInit() {
    // await DocumentScanner.installGoogleDocumentScannerModule();
     const { nextBundleId } = await LiveUpdate.sync();
      if (nextBundleId) {
        const shouldReload = confirm("A new update is available. Would you like to install it?");
        if (shouldReload) {
          await LiveUpdate.reload();
        }
      }
  }

  constructor(){
    App.addListener("resume", async () => {
      const { nextBundleId } = await LiveUpdate.sync();
      if (nextBundleId) {
        // Ask the user if they want to apply the update immediately
        const shouldReload = confirm("A new update is available. Would you like to install it?");
        if (shouldReload) {
          await LiveUpdate.reload();
        }
      }
    });
  }

  async startDocumentScan() {
    try {
      const result = await DocumentScanner.scanDocument({ resultFormats: 'PDF' });
      if (result.pdf) {
        const uri = result.pdf.uri;
        const filePathMatch = uri.match(/^file:\/\/(.*)$/);
        const fullPath = filePathMatch ? filePathMatch[1] : uri;
        const newFileName = this.documentName ? `${this.documentName}.pdf` : `scanned-document-${Date.now()}.pdf`;
        // if it is always in the cache
        const cacheIndex = fullPath.indexOf('/cache/');
        if (cacheIndex === -1) {
          console.error('Scanned PDF is not in cache directory. Cannot rename. URI:', uri);
          alert('Scanned PDF is not in cache directory. Cannot rename.');
          Share.share({ url: uri });
          return;
        }
        const relativePath = fullPath.substring(cacheIndex + '/cache/'.length);
        await Filesystem.rename({
          from: relativePath,
          to: newFileName,
          directory: Directory.Cache,
        });

        let newFileUri = uri.replace(/[^\/]+$/, newFileName);
        console.log('File renamed successfully:', newFileUri);
        Share.share({ url: newFileUri });
      }
      // result.pdfInfo; // { uri: string, pageCount: number }
      // this.documentImageData = result.scannedImages;
      console.log('Document scan result:', result);
    } catch (error) {
      console.error('Error during document scan:', error);
    }
  }

}

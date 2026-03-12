import { Component } from '@angular/core';
import { LiveUpdate } from '@capawesome/capacitor-live-update';
import { App } from '@capacitor/app';
import { DocumentScanner } from '@capacitor-mlkit/document-scanner';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

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

  startDocumentScan(){
    DocumentScanner.scanDocument({ resultFormats: 'PDF'}).then((result) => {
      if (result.pdf) {
        Share.share({ url: result.pdf.uri});
      }
      // result.pdfInfo; // { uri: string, pageCount: number }
      // this.documentImageData = result.scannedImages;
    }).then((result) => {
      console.log('Document scan result:', result);
    }).catch((error) => {
      console.error('Error during document scan:', error);
    });
  }

}

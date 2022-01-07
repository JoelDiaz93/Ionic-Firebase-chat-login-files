import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { finalize, tap } from 'rxjs/operators';
import { FirebaseService } from '../shared/firebase.service';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private PHOTO_STORAGE = 'photos';
  private isFileUploading: boolean;
  private isFileUploaded: boolean;
  private imgName: string;
  private fileSize: number;
  private userID: string;
  private userEmail: string;
  private message: string;
  private chats: any = [];
  private tmpImage: any = undefined;
  private encryptKey = '*/*-$%^@!@#';
  private fileUploadTask: AngularFireUploadTask;

  // Upload progress
  private percentageVal: Observable<number>;

  // Track file uploading with snapshot
  private trackSnapshot: Observable<any>;

  // Uploaded File URL
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private UploadedImageURL: Observable<string>;

  // Uploaded image collection
  private files: Observable<any[]>;

  private filesCollection: AngularFirestoreCollection<ImgFile>;

  constructor(
    private platform: Platform,
    private firebaseServ: FirebaseService,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {}

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (const photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  /* Use the device camera to take a photo:
  // https://capacitor.ionicframework.com/docs/apis/camera
  // Store the photo data into permanent file storage:
  // https://capacitor.ionicframework.com/docs/apis/filesystem
  // Store a reference to all photo filepaths using Storage API:
  // https://capacitor.ionicframework.com/docs/apis/storage
  */

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  storeFilesFirebase(file: any) {
    const fileId = this.afs.createId();

    this.filesCollection
      .doc(fileId)
      .set(file)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async uploadImage(userID: string, userEmail: string, cameraPhoto: Photo) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    // const convertedImage = 'data:image/jpeg;base64,'+base64Data;
    // const fileName = cameraPhoto.webPath;

    let messageToSend = {};
    messageToSend = {
      uid: userID,
      email: userEmail,
      imageMessage: crypto.AES.encrypt(base64Data, this.encryptKey).toString(),
    };
    this.tmpImage = undefined;
    try {
      await this.firebaseServ.sendMessage(messageToSend);
      this.message = '';
    } catch (e) {
      console.log('error', e);
    }
  }

  public async addNewToGallery(userID: string, userEmail: string) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    await this.uploadImage(userID, userEmail, capturedPhoto);

    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // Save picture to file on device
  private async savePicture(cameraPhoto: Photo) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    console.log(fileName);

    // Image validation
    // if (file.type.split('/')[0] !== 'image') {
    //   console.log('File type is not supported!');
    //   return;
    // }

    this.isFileUploading = true;
    this.isFileUploaded = false;

    // Storage path
    const fileStoragePath = `chats/${new Date().getTime()}.${fileName}`;
    console.log('URLimage: ', fileStoragePath);

    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);

    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, savedFile);

    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();

        this.UploadedImageURL.subscribe(
          async (resp) => {
            this.storeFilesFirebase({
              name: fileName,
              filepath: resp,
              size: this.fileSize,
            });

            this.isFileUploading = false;
            this.isFileUploaded = true;
          },
          (error) => {
            console.log(error);
          }
        );
      }),
      tap((snap) => {
        this.fileSize = snap.totalBytes;
      })
    );

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(cameraPhoto: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}

export interface ImgFile {
  name: string;
  filepath: string;
  size: number;
}

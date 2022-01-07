import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from '../shared/authentication-service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { FirebaseService } from '../shared/firebase.service';

import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import * as crypto from 'crypto-js';
import { PhotoService } from '../services/photo.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userID: string;
  userEmail: string;
  message: string;
  chats: any = [];
  tmpImage: any = undefined;
  encryptKey = '*/*-$%^@!@#';

  // File upload task
  fileUploadTask: AngularFireUploadTask;

  // Upload progress
  percentageVal: Observable<number>;

  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;

  // Uploaded File URL
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UploadedImageURL: Observable<string>;

  // Uploaded image collection
  files: Observable<any[]>;

  // Image specifications
  imgName: string;
  fileSize: number;

  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;

  private filesCollection: AngularFirestoreCollection<imgFile>;

  constructor(
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private firebaseServ: FirebaseService,
    private actionSheetController: ActionSheetController,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    public photoService: PhotoService
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }

  ngOnInit() {
    this.authService.userDetails().subscribe(
      (res) => {
        console.log('res', res);
        if (res !== null) {
          this.userID = res.uid;
          this.userEmail = res.email;
        } else {
          this.navCtrl.navigateBack('');
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
    this.firebaseServ.getMessage().on('value', (messageSnap) => {
      this.chats = [];
      messageSnap.forEach((messageData) => {
        console.log('messageData', messageData.val());
        if (messageData.val().imageMessage) {
          this.chats.push({
            email: messageData.val().email,
            imageMessage: crypto.AES.decrypt(
              messageData.val().imageMessage,
              this.encryptKey
            ).toString(crypto.enc.Utf8),
            uid: messageData.val().uid,
          });
        } else {
          this.chats.push({
            email: messageData.val().email,
            message: crypto.AES.decrypt(
              messageData.val().message,
              this.encryptKey
            ).toString(crypto.enc.Utf8),
            uid: messageData.val().uid,
          });
        }
      });
    });
  }

  logout() {
    this.authService
      .SignOut()
      .then((res) => {
        console.log(res);
        this.navCtrl.navigateBack('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendMessage() {
    let messageToSend = {};
    if (this.tmpImage !== undefined) {
      messageToSend = {
        uid: this.userID,
        email: this.userEmail,
        imageMessage: crypto.AES.encrypt(
          this.message,
          this.encryptKey
        ).toString(),
      };
      this.tmpImage = undefined;
    } else {
      messageToSend = {
        uid: this.userID,
        email: this.userEmail,
        message: crypto.AES.encrypt(this.message, this.encryptKey).toString(),
      };
    }
    try {
      await this.firebaseServ.sendMessage(messageToSend);
      this.message = '';
    } catch (e) {
      console.log('error', e);
    }
  }

  async uploadImage(event: FileList) {
    const file = event.item(0);

    // Image validation
    // if (file.type.split('/')[0] !== 'image') {
    //   console.log('File type is not supported!');
    //   return;
    // }

    this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = file.name;

    // Storage path
    const fileStoragePath = `chats/${new Date().getTime()}_${file.name}`;
    console.log('URLimage: ', fileStoragePath);
    let messageToSend = {};
    if (this.tmpImage !== undefined) {
      messageToSend = {
        uid: this.userID,
        email: this.userEmail,
        imageMessage: crypto.AES.encrypt(
          fileStoragePath,
          this.encryptKey
        ).toString(),
      };
      this.tmpImage = undefined;
    } else {
      messageToSend = {
        uid: this.userID,
        email: this.userEmail,
        message: crypto.AES.encrypt(this.message, this.encryptKey).toString(),
      };
    }
    try {
      await this.firebaseServ.sendMessage(messageToSend);
      this.message = '';
    } catch (e) {
      console.log('error', e);
    }

    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);

    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);

    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(
      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();

        this.UploadedImageURL.subscribe(
          (resp) => {
            this.storeFilesFirebase({
              name: file.name,
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
  }

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

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}

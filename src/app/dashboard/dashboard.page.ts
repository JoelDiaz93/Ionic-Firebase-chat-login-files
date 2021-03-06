import { Component, OnInit, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthenticationService } from '../shared/authentication-service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { FirebaseService } from '../shared/firebase.service';
import { CallbackID, Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

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
  // coordinate attribute
  coordinate: any;
  userID: string;
  userEmail: string;
  message: string;
  chats: any = [];
  tmpImage: any = undefined;
  encryptKey = '*/*-$%^@!@#';

  newFile: any;

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
    public photoService: PhotoService,
    private zone: NgZone
  ) {
    this.isFileUploading = false;
    this.isFileUploaded = false;
    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }

  // Geolocation functions
  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
  }

  async getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    await Geolocation.getCurrentPosition()
      .then((data) => {
        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy,
        };
      })
      .catch((err) => {
        console.error(err);
      });
  }

  ngOnInit() {
    // Get coordinate in mount of component
    this.getCurrentCoordinate();
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
        } else if (
          messageData.val().message === 'Mis coordenadas actuales son:'
        ) {
          //console.log("CADA OBJETO CONTIENE LA LOCALIZACION", messageData.val());
          this.chats.push({
            email: messageData.val().email,
            message: messageData.val().message,
            latitude: messageData.val().location.latitude,
            longitude: messageData.val().location.longitude,
          });
        } else {
          this.chats.push({
            email: messageData.val().email,
            message: crypto.AES.decrypt(
              messageData.val().message,
              this.encryptKey
            ).toString(crypto.enc.Utf8),
            uid: messageData.val().uids,
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

  //Send Location to database
  async sendLocation() {
    let messageToSend = {};
    messageToSend = {
      uid: this.userID,
      email: this.userEmail,
      message: 'Mis coordenadas actuales son:',
      location: {
        latitude: this.coordinate.latitude,
        longitude: this.coordinate.longitude,
      },
    };
    try {
      await this.firebaseServ.sendMessage(messageToSend);
      this.message = '';
    } catch (e) {
      console.log('error', e);
    }
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

  async uploadFile(event: FileList) {
    this.newFile = event.item(0);
    const fileStoragePath = `chats/${new Date().getTime()}_${
      this.newFile.name
    }`;
    if (event.item(0)) {
      const reader = new FileReader();
      reader.onload = async (fileUp) => {
        // this.newProducto.foto = file.target.result as string;
        console.log('ref: ', fileUp.target.result as string);
        let messageToSend = {};
        messageToSend = {
          uid: this.userID,
          email: this.userEmail,
          imageMessage: crypto.AES.encrypt(
            fileUp.target.result as string,
            this.encryptKey
          ).toString(),
        };
        this.tmpImage = undefined;
        try {
          await this.firebaseServ.sendMessage(messageToSend);
          this.message = '';
        } catch (e) {
          console.log('error', e);
        }
      };
      reader.readAsDataURL(event.item(0));
    }

    const file = event.item(0);

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
    this.photoService.addNewToGallery(this.userID, this.userEmail);
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigFb } from '../auth-fb/data-models/config-fb.model';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  CollectionReference,
  Firestore,
  getFirestore,
  collection,
} from 'firebase/firestore';

@Injectable()
export class FirebaseService {
  public appFb: FirebaseApp;
  public auth: Auth;
  public firestore: Firestore;

  // Collections
  public usersCollection: CollectionReference;

  constructor(private configService: ConfigService<ConfigFb>) {
    this.appFb = initializeApp({
      apiKey: configService.get<string>('apiKey'),
      appId: configService.get<string>('appId'),
      authDomain: configService.get<string>('authDomain'),
      measurementId: configService.get<string>('measurementId'),
      messagingSenderId: configService.get<string>('messagingSenderId'),
      projectId: configService.get<string>('projectId'),
      storageBucket: configService.get<string>('storageBucket'),
    });

    this.auth = getAuth(this.appFb);
    this.firestore = getFirestore(this.appFb);

    this._createCollections();

  } //end of constructor

  private _createCollections(){
    this.usersCollection = collection(this.firestore, 'users');
  }

}//end of class FirebaseService

// auth-fb.service.ts

import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UserFb } from './data-models/user-fb.model';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import {
  setDoc,
  DocumentReference,
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { Logger } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AuthFbService {
  constructor(private firebaseService: FirebaseService) {}

  private readonly logger = new Logger(AuthFbService.name);

  public async register(body: Omit<UserFb, 'id'>): Promise<void> {
    try {
      //-----------------------------------------------
      const userCredentials: UserCredential =
        await createUserWithEmailAndPassword(
          this.firebaseService.auth,
          body.email,
          body.password,
        );

      if (userCredentials) {
        const id: string = userCredentials.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          id,
        );

        await setDoc(docRef, body);
      } //end of if credentials exist
      //-----------------------------------------------
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `>> ERROR >>  ROUTE Patch [auth-fb.service metho=register] Could not create new user, firebase returned this error : ${error}`,
      );
    }
  } //end register method

  public async login(
    email: string,
    password: string,
  ): Promise<Omit<UserFb, 'password'>> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.auth,
        email,
        password,
      );

      //If the user exists
      if (userCredential) {
        const id: string = userCredential.user.uid;
        const docRef: DocumentReference = doc(
          this.firebaseService.usersCollection,
          id,
        );

        const snapshot: DocumentSnapshot<DocumentData> = await getDoc(docRef);
        const loggedUser: UserFb = {
          ...snapshot.data(),
          id: snapshot.id,
        } as UserFb;

        //Removing the password key-value from the 'data' object before sending it as reply
        delete loggedUser.password;

        return loggedUser;
      }
    } catch (error: unknown) {
      throw new InternalServerErrorException(
        `>> ERROR >>  ROUTE Patch [auth-fb.service method=login] Could not create new user, firebase returned this error : ${error}`,
      );
    }
  } // end login method
} //end of AuthFbService

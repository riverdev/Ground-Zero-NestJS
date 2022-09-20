import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

// Import the functions you need from the SDKs you need
import * as firebase from 'firebase-admin';
import { jsonPrettify } from '../common/helpers/global.helper';
import * as serviceAccount from './auth-fb-firebaseServiceAccount.json';

const firebase_params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor() {
    //The following "if" needed to support the e2e tests.
    //What it does is make sure that we dont trigger twice the
    // "initiializeApp", this happens whe running the "userfiledb.e2e.spec.ts"
    if (firebase.apps.length === 0) {
      this.defaultApp = firebase.initializeApp({
        credential: firebase.credential.cert(firebase_params),
        // databaseURL: 'https://fir-auth-bd895.firebaseio.com',
      });
    } //end of if firebase.apps doesnt exist
  }

  // use(req: any, res: any, next: (error?: any) => void) {
  //   throw new Error('Method not implemented.');
  // }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;

    if (token != null && token != '') {
      this.defaultApp
        .auth()
        .verifyIdToken(token.replace('Bearer ', ''))
        .then(async (decodedToken) => {
          const user = {
            email: decodedToken.email,
          };
          req['user'] = user;
          next();
        })
        .catch((error) => {
          console.error(error);
          this.accessDenied(req.url, res);
        });
    } else {
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied',
    });
  }
}

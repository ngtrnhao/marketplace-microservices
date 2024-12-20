import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID'),
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'),
      callbackURL: 'http://localhost:3001/api/auth/facebook/callback',
      scope: ['public_profile'],  
      profileFields: ['id', 'name', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { id, name, photos } = profile;
    
    // Tạo email tạm thời từ Facebook ID
    const tempEmail = `${id}@facebook.temp`;
    
    const user = {
      email: tempEmail,
      name: `${name?.givenName || ''} ${name?.familyName || ''}`.trim(),
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
      picture: photos?.[0]?.value,
      accessToken,
      provider: 'facebook',
      providerId: id,
    };
    
    done(null, user);
  }
}

/**
 * Handles authentication with Facebook using the OAuth2 strategy provided by Passport.
 *
 * The strategy requires the following environment variables:
 *
 * - `FACEBOOK_APP_ID`: The app ID provided by Facebook.
 * - `FACEBOOK_APP_SECRET`: The app secret provided by Facebook.
 * - `FACEBOOK_CALLBACK_URL`: The callback URL provided by Facebook.
 *
 * The strategy validates the user profile and constructs a user object with the following properties:
 *
 * - `firstName`: The first name from the user's Facebook profile.
 * - `lastName`: The last name from the user's Facebook profile.
 * - `picture`: The profile picture URL from the user's Facebook profile.
 * - `accessToken`: The access token provided by Facebook.
 */

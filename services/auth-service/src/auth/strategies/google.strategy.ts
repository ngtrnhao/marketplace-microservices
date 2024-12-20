import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;

    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
/**
 * Handles authentication with Google using the OAuth2 strategy provided by Passport.
 *
 * The strategy requires the following environment variables:
 *
 * - `GOOGLE_CLIENT_ID`: The client ID provided by Google.
 * - `GOOGLE_CLIENT_SECRET`: The client secret provided by Google.
 * - `GOOGLE_CALLBACK_URL`: The callback URL provided by Google.
 *
 * The strategy validates the user profile and constructs a user object with the following properties:
 *
 * - `email`: The email address from the user's Google profile.
 * - `firstName`: The first name from the user's Google profile.
 * - `lastName`: The last name from the user's Google profile.
 * - `picture`: The profile picture URL from the user's Google profile.
 * - `accessToken`: The access token provided by Google.
 */

/**
 * Validates the Google user profile and constructs a user object.
 *
 * @param accessToken - The access token provided by Google.
 * @param refreshToken - The refresh token provided by Google.
 * @param profile - The user's profile information from Google.
 * @param done - Callback to pass the user object or errors.
 * @returns A promise that resolves with the user object.
 */
/**
 * Constructs a user object with the following properties:
 *
 * - `email`: The email address from the user's Google profile.
 * - `firstName`: The first name from the user's Google profile.
 * - `lastName`: The last name from the user's Google profile.
 * - `picture`: The profile picture URL from the user's Google profile.
 * - `accessToken`: The access token provided by Google.
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { JwtPayload } from './jwt-payload.interface'; // Define this interface separately

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'wjdnjwdj23423', // Make sure to use a secure secret in production
    });
  }

  async validate(payload: JwtPayload) {
    // Here you can add additional validation logic
    return { userId: payload.userId, role: payload.role };
  }
}

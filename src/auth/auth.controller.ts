import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decoratores';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() userDto) {
    return this.authService.register(userDto);
  }
  @Public()
  @Post('login')
  login(@Body() userDto) {
    return this.authService.login(userDto);
  }
}

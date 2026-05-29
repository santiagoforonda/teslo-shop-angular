import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { firstValueFrom } from "rxjs";

export const NotAuthenticatedGuard: CanMatchFn = async () => {

  const authService = inject(AuthService);

  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkAuthStatus());

  if (isAuthenticated) {
    return router.parseUrl("/");
  }
  return true;
};

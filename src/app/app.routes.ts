import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [

{
  path:"auth",
  loadChildren:()=> import("./auth/auth.route"),
  canMatch:[
      NotAuthenticatedGuard
  ]

},
{
  path:"admin",
  loadChildren:()=>import("./admin-dashboard/admin-dashboard.route")

},
{
  path:"",
  loadChildren:()=> import("./store-front/store-front.route")
}

];

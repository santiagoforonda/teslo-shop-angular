import { computed, inject, Injectable, signal } from "@angular/core";
import { User } from "../interfaces/user.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AuthResponse } from "../interfaces/auth-response.interface";
import { catchError, map, Observable, of, tap } from "rxjs";
import { rxResource } from "@angular/core/rxjs-interop";

type AuthStatus = "checking" | "authenticated" | "not-authenticated";
const baseUrl = environment.baseUrl;


@Injectable({providedIn:"root"})
export class AuthService{


  private readonly _authStatus = signal<AuthStatus>("checking");
  private readonly _user = signal<User|null>(null);
  private readonly _token = signal<string|null>(localStorage.getItem("token"));

  private readonly http = inject(HttpClient);

  checkStatusResource = rxResource({
    stream:()=> this.checkAuthStatus()
  });

  authStatus = computed<AuthStatus>(()=>{
    if(this._authStatus() === "checking"){
      return "checking";
    }

    if(this._user()){
      return "authenticated"
    }

    return "not-authenticated"
  });

  user = computed<User|null>(()=> this._user());
  token = computed(this._token);

  login(email:string,password:string):Observable<boolean>{
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`,{
      email,
      password
    }).pipe(
        tap(res =>{
          this.handleLoginSuccess(res);
        }),
        map((res)=> this.handleLoginSuccess(res)),
        catchError((error)=> this.handleAuthError(error))
    );
  }

  checkAuthStatus():Observable<boolean>{
    const token = localStorage.getItem("token");
    if(!token){
      this.logOut();
      return of(false);
    }

    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`).pipe(
      tap(res =>{
          this.handleLoginSuccess(res);
        }),
        map(()=>true),
        catchError((error)=> this.handleAuthError(error))
    )

  }

  logOut(){
    this._authStatus.set("not-authenticated");
    this._user.set(null);
    this._token.set(null);

    localStorage.removeItem("token");
  }

  private handleLoginSuccess(res:AuthResponse){
    this._authStatus.set("authenticated");
          this._user.set(res.user)
          this._token.set(res.token)

          localStorage.setItem("token",res.token);

          return true;
  }

  private handleAuthError(error:any){
    this.logOut();
    return of(false);
  }

}

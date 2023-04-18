import {mockRequest, request} from '../request';
import {adapter} from "@/utils";
import {transfer} from "@/service/api/management.adapter";

export function fetchSmsCode(phone: string) {
  return mockRequest.post<boolean>('/getSmsCode', {phone});
}

export function fetchLogin(userName: string, password: string) {
  return mockRequest.post<ApiAuth.Token>('/login', {userName, password});
}

export const authAuthenticate = async (username: string, password: string) => {
  const data = await request.post<ApiAuth.Token>('/auth/authenticate', {username, password})
  return adapter(transfer<Record<string, any>, ApiAuth.Token>((d): ApiAuth.Token => {
    return {
      token: d['accessToken'],
      refreshToken: d['refreshToken']
    }
  }), data);
}

export const fetchUserInfo = async () => {
  const data = await request.get<ApiAuth.UserInfo>('/auth/user');
  return adapter(transfer<Record<string, any>, ApiAuth.UserInfo>((d): ApiAuth.UserInfo => {
    const u: ApiAuth.UserInfo = {userId: "", userName: "", userRole: "admin"}
    Object.assign(u, d)
    u.userId = d['id']
    u.userName = d['username']
    //
    u.userAvatar = 'avatar3'
    return u
  }), data);
}

export function fetchUserRoutes(userId: string) {
  return mockRequest.post<ApiRoute.Route>('/getUserRoutes', {userId});
}

export function fetchUpdateToken(refreshToken: string) {
  return mockRequest.post<ApiAuth.Token>('/updateToken', {refreshToken});
}

import {adapter} from '@/utils';
import {mockRequest} from '../request';
import {adapterOfFetchUserList, adapterOfFetchUser} from './management.adapter';

export const fetchUserList = async () => {
  const data = await mockRequest.post<ApiCommon.PageResult<ApiUserManagement.User[]> | null>('/getAllUserList');
  return adapter(adapterOfFetchUserList, data);
};
export const fetchUser = async (id: string) => {
  const data = await mockRequest.post<ApiUserManagement.User | null>(`/getUser/${id}`);
  return adapter(adapterOfFetchUser, data);
};

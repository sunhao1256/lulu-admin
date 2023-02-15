export function adapterOfFetchUserList(data: ApiCommon.PageResult<ApiUserManagement.User[]> | null): ApiCommon.PageResult<UserManagement.User[]> {
  if (!data) return {
    pageNo: 1,
    pageSize: 20,
    list: [],
    total: 0,
  };

  return {
    total: data.total,
    pageNo: data.pageNo,
    pageSize: data.pageSize,
    list: data.list.map((item, index) => {
      const user: UserManagement.User = {
        role: 'user',
        ...item
      };
      return user;
    })
  }
}

export function adapterOfFetchUser(data: ApiUserManagement.User | null): UserManagement.User | null {
  if (!data) return null;

  const user: UserManagement.User = {
    role: 'user',
    ...data
  };
  return user
}

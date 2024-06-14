'use-client';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

type TUser = {
  user_id: number;
  username: string;
  email: string;
};

export function useUser() {
  const [user, setUser] = useState<TUser | null>(null);
  useEffect(() => {
    const access_token = Cookies.get('accessToken');
    if (access_token) {
      const user = jwtDecode<TUser>(access_token);
      setUser({
        user_id: user.user_id,
        username: user.username,
        email: user.email
      });
    }
  }, []);

  return {
    user_id: user?.user_id,
    username: user?.username,
    email: user?.email
  };
}

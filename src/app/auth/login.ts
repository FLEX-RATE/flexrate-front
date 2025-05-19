import axios from '../../lib/axios';

export const login = async (email: string, password: string) => {
  const res = await axios.post('/auth/login', { email, password });
  return res.data;
};

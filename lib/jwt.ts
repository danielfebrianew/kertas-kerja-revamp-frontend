// lib/jwt.ts

export interface JwtPayload {
  email: string;
  exp: number;
  iat: number;
  iss: string;
  kode_opd: string;
  nama_opd: string;
  nama_pegawai: string;
  nip: string;
  pegawai_id: string;
  roles: string[];
  user_id: number;
}

export function decodeJwt(token: string): JwtPayload {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

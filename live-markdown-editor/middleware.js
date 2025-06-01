// import { NextResponse } from 'next/server';
// import { jwtVerify } from 'jose';

// const JWT_SECRET = process.env.NEXT_PUBLICJWT_SECRET || "defaultsecret";
// const secret = new TextEncoder().encode(JWT_SECRET);

// export async function middleware(request) {
//   const { pathname } = request.nextUrl;

//   const publicRoutes = ['/'];

//   const isPublic = publicRoutes.includes(pathname)
//     || pathname.startsWith('/_next') 
//     || pathname.startsWith('/favicon.ico') 
//     || pathname.startsWith('/images') 
//     || pathname.startsWith('/fonts');

//   if (isPublic) {
//     return NextResponse.next();
//   }

//   const token = request.cookies.get('accessToken')?.value;

//   if (!token) {
//     console.log('No token');
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   try {
//     await jwtVerify(token, secret);
//     console.log('Token verified');
//     return NextResponse.next();
//   } catch (err) {
//     console.log('Token not verified', err);
//     return NextResponse.redirect(new URL('/', request.url));
//   }
// }

// export const config = {
//   matcher: ['/((?!_next|favicon.ico|images|fonts|api).*)'],
// };

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/', '/auth/signin', '/auth/signup'];

  const isPublic =
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts');

  if (isPublic) return NextResponse.next();

  const token = request.cookies.get('accessToken')?.value || request.cookies.get('refreshToken')?.value;

  if (!token) {
    console.log('No access token cookie found');
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|fonts|api).*)'],
};

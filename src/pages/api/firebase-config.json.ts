import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({
    apiKey: 'AIzaSyBBEidXiLDhLumocfQuZAormy1_dFwL9EY',
    authDomain: 'chirag-127.firebaseapp.com',
    projectId: 'chirag-127',
    storageBucket: 'chirag-127.firebasestorage.app',
    messagingSenderId: '308014403143',
    appId: '1:308014403143:web:eb46f53b0943ece31f6b62',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

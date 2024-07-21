// pages/index.js
import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
import Chat from '@/components/chat';
import { FirebaseProvider } from '@/firebase/firebase';
export default function Home() {
  return (
    <>

      <FirebaseProvider>
        <Head>
          <title>UIKit with NextJS 13</title>
          <meta name="description" content="" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main
          className={`flex min-h-screen flex-col items-center justify-between no-scrollbar`}
        >
          <Chat />
        </main>
      </FirebaseProvider>
    </>
  )
}
import Head from 'next/head'
import { Inter } from 'next/font/google'

export default function Home() {
    return (
        <>
        <div className="min-h-screen bg-slate-50">
            <Head>
                <title>LFG</title>
                <meta name="description" content="Fractional shares of real estate in the Web3" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h2>
                    Hi there, here is the Home Page
                </h2>
            </main>

            <footer>
                <div>
                    <p>&copy; 2023 LFG. All rights reserved.</p>
                </div>
            </footer>
        </div>
        </>
  )
}

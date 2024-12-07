import { UnifiedWalletButton, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import AppHeader from 'src/components/AppHeader/AppHeader';
import Footer from 'src/components/Footer/Footer';
import SwapfyIcon from 'src/icons/SwapfyIcon';

//import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import classNames from 'classnames';
// import { useForm } from 'react-hook-form';
import CodeBlocks from 'src/components/CodeBlocks/CodeBlocks';
import FormConfigurator from 'src/components/FormConfigurator';
//import { IFormConfigurator, INITIAL_FORM_CONFIG} from 'src/constants';
import { JUPITER_DEFAULT_RPC } from 'src/constants';
import IntegratedTerminal from 'src/content/IntegratedTerminal';
import ModalTerminal from 'src/content/ModalTerminal';
import WidgetTerminal from 'src/content/WidgetTerminal';
import { IInit } from 'src/types';
import V2SexyChameleonText from 'src/components/SexyChameleonText/V2SexyChameleonText';
import FeatureShowcaseButton from 'src/components/FeatureShowcaseButton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setTerminalInView } from 'src/stores/jotai-terminal-in-view';

const isDevNodeENV = process.env.NODE_ENV === 'development';
const isDeveloping = isDevNodeENV && typeof window !== 'undefined';
// In NextJS preview env settings
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
    // Initialize an empty value, simulate webpack IIFE when imported
    (window as any).Jupiter = {};

    // Perform local fetch on development, and next preview
    Promise.all([import('../library'), import('../index')]).then((res) => {
        const [libraryProps, rendererProps] = res;

        (window as any).Jupiter = libraryProps;
        (window as any).JupiterRenderer = rendererProps;
    });
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    const [tab, setTab] = useState<IInit['displayMode']>('integrated');
    
    //New to avoid errors
    useEffect(() => {
    if (typeof window !== 'undefined' && window.Jupiter && window.Jupiter._instance) {
        window.Jupiter._instance = null;
    }

    setTerminalInView(false);
}, [tab]);
    
    const rpcUrl = useMemo(() => JUPITER_DEFAULT_RPC, []);

       // Add static configuration instead
    const watchAllFields = {
        simulateWalletPassthrough: true,
        refetchIntervalForTokenAccounts: 10000,
        formProps: {},
        strictTokenList: true,
        defaultExplorer: 'solscan',

        useUserSlippage: false
    };

    // Solflare wallet adapter comes with Metamask Snaps supports
    //const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()], []);
    const wallets = useMemo(() => [new SolflareWalletAdapter()], []);

    const ShouldWrapWalletProvider = useMemo(() => {
        return watchAllFields.simulateWalletPassthrough
            ? ({ children }: { children: ReactNode }) => (
                <UnifiedWalletProvider
                    wallets={wallets}
                    config={{
                        env: 'mainnet-beta',
                        autoConnect: true,
                        metadata: {
                            name: 'SWAPFY Terminal',
                            description: '',
                            url: 'https://swapfy.fun',
                            iconUrls: [''],
                        },
                        theme: 'jupiter',
                    }}
                >
                    {children}
                </UnifiedWalletProvider>
            )
            : React.Fragment;
    }, [wallets, watchAllFields.simulateWalletPassthrough]);

    return (
        <QueryClientProvider client={queryClient}>
            <DefaultSeo
                title={'SWAPFY DEcentralized Exchange'}
                openGraph={{
                    type: 'website',
                    locale: 'en',
                    title: 'SWAPFY Decentralized Exchange',
                    description: 'SWAPFY Decentralized Exchange: An open-sourced, DEX liquidity pool agregator that provides end-to-end swap flow.',
                    url: 'https://swapfy.fun',
                    site_name: 'SWAPFY Decentralized Exchange',
                    images: [
                        {
                            url: `https://swapfy.fun`,
                            alt: 'SWAPFY Decentralized Exchange',
                        },
                    ],
                }}
                twitter={{
                    cardType: 'summary_large_image',
                    site: 'Swapfy',
                    handle: '@swapfydotfun'
                }}
            />
            <div className="bg-v3-bg min-h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between">
                <div>
                    <AppHeader />
                    <Component
                        {...pageProps}
                        rpcUrl={rpcUrl}
                        watchAllFields={watchAllFields}
                        ShouldWrapWalletProvider={ShouldWrapWalletProvider}
                    />
                </div>
                <div className="w-full mt-auto">
                    <Footer />
                </div>
            </div>
        </QueryClientProvider>
    );
}
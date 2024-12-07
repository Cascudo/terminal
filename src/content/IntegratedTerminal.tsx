import React, { useCallback, useEffect, useState } from 'react';
import { DEFAULT_EXPLORER, FormProps } from 'src/types';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';
import { PublicKey } from '@solana/web3.js';

const IntegratedTerminal = (props: {
    rpcUrl: string;
    refetchIntervalForTokenAccounts?: number;
    formProps: FormProps;
    simulateWalletPassthrough: boolean;
    strictTokenList: boolean;
    defaultExplorer: DEFAULT_EXPLORER;
    useUserSlippage: boolean;
}) => {
    const {
        rpcUrl,
        formProps,
        simulateWalletPassthrough,
        strictTokenList,
        defaultExplorer,
        useUserSlippage,
        refetchIntervalForTokenAccounts,
    } = props;
    const [isLoaded, setIsLoaded] = useState(false);

    const passthroughWalletContextState = useWallet();
    const { setShowModal } = useUnifiedWalletContext();

    const launchTerminal = useCallback(async () => {

        window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'integrated-terminal',
            endpoint: rpcUrl,
            refetchIntervalForTokenAccounts,
            formProps,
            enableWalletPassthrough: simulateWalletPassthrough,
            passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
            onRequestConnectWallet: () => setShowModal(true),
            strictTokenList,
            defaultExplorer,
            useUserSlippage,
            platformFeeAndAccounts: {
                referralAccount: new PublicKey('6sBhr7PvQNizNDzin66r1WhznJXXqpGtpHct6ZamfHUe'),
                feeBps: 35  // This sets a 0.35% fee (35 basis points)
            }
        });
    }, [
        defaultExplorer,
        formProps,
        passthroughWalletContextState,
        rpcUrl,
        setShowModal,
        simulateWalletPassthrough,
        strictTokenList,
        useUserSlippage,
        refetchIntervalForTokenAccounts,
    ]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout | undefined = undefined;
        if (!isLoaded || !window.Jupiter.init) {
            intervalId = setInterval(() => {
                setIsLoaded(Boolean(window.Jupiter.init));
            }, 500);
        }

        if (intervalId) {
            return () => clearInterval(intervalId);
        }
    }, [isLoaded]);

    useEffect(() => {
        setTimeout(() => {
            if (isLoaded && Boolean(window.Jupiter.init)) {
                launchTerminal();
            }
        }, 200);
    }, [isLoaded, simulateWalletPassthrough, props, launchTerminal]);

    // To make sure passthrough wallet are synced
    useEffect(() => {
        if (!window.Jupiter.syncProps) return;
        window.Jupiter.syncProps({ passthroughWalletContextState });
    }, [passthroughWalletContextState, props]);

    return (
        <div className="min-h-[auto] h-[auto] w-full rounded-2xl text-white flex flex-col items-center p-2 lg:p-4 mb-4 overflow-hidden mt-2">
            <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
                <div className="w-full h-full rounded-xl overflow-hidden flex justify-center">
                    {/* Loading state */}
                    {!isLoaded ? (
                        <div className="h-full w-full animate-pulse bg-[#4A90E2]/10 mt-2 lg:mt-0 lg:ml-4 flex items-center justify-center rounded-xl">
                            <p className="text-[#4A90E2] font-semibold">Loading...</p>
                        </div>
                    ) : null}
                    <div
    id="integrated-terminal"
    className={`flex w-full max-w-[480px] justify-center bg-[#13111C] rounded-xl shadow-lg relative backdrop-blur-sm border border-white/10 hover:border-[#14F195]/50 transition-all duration-300 animate-fadeIn ${!isLoaded ? 'visible' : ''}`}
    style={{
        minHeight: '520px',
        height: 'auto',
        boxShadow: `
            0 0 clamp(10px, 2vw, 20px) 0 rgba(153, 69, 255, 0.2),  // Changed to #9945FF
            0 0 clamp(20px, 3vw, 40px) 0 rgba(153, 69, 255, 0.1),
            0 0 clamp(30px, 4vw, 60px) 0 rgba(20, 241, 149, 0.1),  // Changed to #14F195
            inset 0 0 clamp(10px, 2vw, 20px) 0 rgba(153, 69, 255, 0.05),
            inset 0 0 clamp(20px, 3vw, 40px) 0 rgba(20, 241, 149, 0.05)
        `,
        background: 'linear-gradient(145deg, #13111C 0%, #170F2D 100%)'  // Your brand gradient
    }}
/>
                </div>
            </div>
        </div>
    );
};

export default IntegratedTerminal;

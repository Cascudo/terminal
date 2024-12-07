// src/pages/swap.tsx
import React, { useState, useEffect } from 'react';
import SwapTerminal from 'src/components/SwapTerminal';

const SwapPage = ({ rpcUrl, watchAllFields, ShouldWrapWalletProvider }: { rpcUrl: string; watchAllFields: any; ShouldWrapWalletProvider: any }) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Function to check if the device is a desktop
        const checkDeviceType = () => {
            if (typeof window !== 'undefined') {
                setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
            }
        };

        checkDeviceType();

        // Add an event listener to update the device type on resize
        window.addEventListener('resize', checkDeviceType);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('resize', checkDeviceType);
        };
    }, []);

    // Show the logo on desktop, hide it on mobile
    const showLogo = isDesktop;

    return (
        <SwapTerminal
            rpcUrl={rpcUrl}
            watchAllFields={watchAllFields}
            ShouldWrapWalletProvider={ShouldWrapWalletProvider}
            showLogo={showLogo}
        />
    );
};

export default SwapPage;
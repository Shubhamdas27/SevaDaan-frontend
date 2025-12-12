// Hook for loading and using Razorpay
import { useState, useEffect, useCallback } from 'react';
import { loadRazorpayScript, RazorpayOptions, RazorpayResponse } from '../lib/razorpay';

/**
 * Custom hook to use Razorpay in functional components
 * @returns Object with loading state and utility functions
 */
export const useRazorpay = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script on component mount
  useEffect(() => {
    let isMounted = true;

    const loadScript = async () => {
      try {
        setIsLoading(true);
        const loaded = await loadRazorpayScript();
        
        if (isMounted) {
          setIsScriptLoaded(loaded);
          setIsLoading(false);
          if (!loaded) {
            setError('Failed to load Razorpay SDK');
          }
        }
      } catch (error) {
        if (isMounted) {
          setError('Error loading Razorpay: ' + (error as Error).message);
          setIsLoading(false);
        }
      }
    };

    loadScript();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Open Razorpay checkout
   * @param options Razorpay options
   * @returns Promise with payment response
   */
  const openCheckout = useCallback((options: RazorpayOptions): Promise<RazorpayResponse> => {
    return new Promise((resolve, reject) => {
      if (!isScriptLoaded) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      try {
        const razorpayOptions = {
          ...options,
          handler: (response: RazorpayResponse) => {
            resolve(response);
            if (options.handler) {
              options.handler(response);
            }
          },
        };

        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } catch (error) {
        console.error('Failed to open Razorpay checkout:', error);
        reject(error);
      }
    });
  }, [isScriptLoaded]);

  return {
    isLoading,
    isScriptLoaded,
    error,
    openCheckout,
  };
};

export default useRazorpay;

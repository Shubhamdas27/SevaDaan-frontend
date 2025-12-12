// Helper functions for Razorpay payment integration

/**
 * Interface for the Razorpay options
 */
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    animation?: boolean;
  };
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
}

/**
 * Interface for the Razorpay response
 */
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

/**
 * Interface for donation payment data
 */
export interface DonationPaymentData {
  id: string;
  orderId: string;
  razorpay: {
    key: string;
    amount: number;
    currency: string;
    orderId: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
  };
}

/**
 * Loads the Razorpay script dynamically
 * @returns Promise that resolves when the script is loaded
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Opens the Razorpay checkout
 * @param options Razorpay options
 * @returns Promise that resolves when payment is complete
 */
export const openRazorpayCheckout = (options: RazorpayOptions): Promise<RazorpayResponse> => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }

    try {
      // Create handler with promise resolution
      const updatedOptions = {
        ...options,
        handler: (response: RazorpayResponse) => {
          resolve(response);
          // Also call the original handler if provided
          if (options.handler) {
            options.handler(response);
          }
        },
        modal: {
          ...options.modal,
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
            // Call original ondismiss if provided
            if (options.modal?.ondismiss) {
              options.modal.ondismiss();
            }
          },
          escape: true,
          animation: true,
        },
      };

      const rzp = new window.Razorpay(updatedOptions);
      
      // Handle errors
      rzp.on('payment.failed', (response: any) => {
        const error = {
          code: response.error.code,
          description: response.error.description,
          source: response.error.source,
          step: response.error.step,
          reason: response.error.reason,
          paymentId: response.error.metadata.payment_id
        };
        reject(error);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay checkout:', error);
      reject(error);
    }
  });
};

/**
 * Initializes a donation payment with Razorpay
 * @param paymentData Payment data from the backend
 * @param description Description text for the payment
 * @param onSuccess Success callback function
 * @param onError Error callback function
 * @returns Promise that resolves when payment is initialized
 */
export const initializeDonationPayment = async (
  paymentData: DonationPaymentData,
  description: string,
  onSuccess: (response: RazorpayResponse) => Promise<void>,
  onError: (error: any) => void
): Promise<void> => {
  try {
    // Load Razorpay script if not already loaded
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Configure Razorpay options
    const options: RazorpayOptions = {
      key: paymentData.razorpay.key,
      amount: paymentData.razorpay.amount * 100, // Amount is in paisa
      currency: paymentData.razorpay.currency,
      name: "SevaDaan NGO Platform",
      description: description,
      order_id: paymentData.razorpay.orderId,
      handler: onSuccess,
      prefill: paymentData.razorpay.prefill,
      notes: paymentData.razorpay.notes,
      theme: {
        color: "#4CAF50"
      },
      modal: {
        escape: false,
        ondismiss: function() {
          onError(new Error('Payment cancelled by user'));
        }
      },
      retry: {
        enabled: true,
        max_count: 3
      }
    };

    // Open the Razorpay checkout
    await openRazorpayCheckout(options);
  } catch (error) {
    console.error('Error initializing payment:', error);
    onError(error);
  }
};

// Declare the Razorpay type on the window object
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

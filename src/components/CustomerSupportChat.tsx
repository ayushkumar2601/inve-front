import React, { useEffect } from 'react';

interface CustomerSupportChatProps {
  className?: string;
}

const CustomerSupportChat: React.FC<CustomerSupportChatProps> = ({ className = '' }) => {
  useEffect(() => {
    // Load NLX Touchpoint when component mounts
    const loadTouchpoint = async () => {
      try {
        // Check if touchpoint is already loaded
        if ((window as any).nlxTouchpoint) {
          return;
        }

        // Create script element for dynamic loading
        const script = document.createElement('script');
        script.type = 'module';
        script.textContent = `
          import { create } from "https://unpkg.com/@nlxai/touchpoint-ui@1.1.7/lib/index.js";
          
          const touchpoint = await create({
            config: {
              applicationUrl: "https://apps.nlx.ai/c/ghQVcm5mSx1sUhSjaeMOM/jeJS0A0e7ayV7ssXdtUxT",
              headers: {
                "nlx-api-key": "tXjLaiRQyw7fHSMYC7pXmNmt45fJgCFv"
              },
              languageCode: "en-US",
              userId: "user_${Date.now()}"
            },
            colorMode: "dark",
            input: "text",
            theme: {
              fontFamily: '"Neue Haas Grotesk", sans-serif',
              accent: "#AECAFF"
            }
          });
          
          // Store the touchpoint instance globally
          window.nlxTouchpoint = touchpoint;
        `;

        document.head.appendChild(script);

        // Cleanup
        return () => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Failed to load NLX Touchpoint:', error);
      }
    };

    loadTouchpoint();
  }, []);

  // This component doesn't render anything visible - the NLX touchpoint handles its own UI
  return null;
};

export default CustomerSupportChat; 
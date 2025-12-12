
import Layout from '../components/common/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last updated: June 20, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the SevaDaan platform ("the Platform"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the Platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>
            SevaDaan is a platform that connects NGOs, donors, and volunteers to facilitate charitable activities, donations, 
            and social impact initiatives across India.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p>
            To access certain features of the Platform, you may be required to create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Providing accurate and complete information</li>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. NGO Registration and Verification</h2>
          <p>
            NGOs registering on our Platform must:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide accurate and complete information</li>
            <li>Submit valid registration documents</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Maintain transparency in their operations and use of donations</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Donations</h2>
          <p>
            When making donations through our Platform:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>You represent that you have the legal right to use the payment method provided</li>
            <li>Transaction fees may apply and will be clearly disclosed</li>
            <li>Receipts will be provided for tax purposes where applicable</li>
            <li>We strive to ensure donations reach their intended recipients but cannot guarantee how NGOs will utilize funds</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
          <p>
            Users may not:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Use the Platform for illegal purposes</li>
            <li>Submit false or misleading information</li>
            <li>Impersonate any person or entity</li>
            <li>Attempt to access unauthorized areas of the Platform</li>
            <li>Engage in any activity that disrupts or interferes with the Platform</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
          <p>
            All content on the Platform, including text, graphics, logos, and software, is the property of SevaDaan or its licensors 
            and is protected by intellectual property laws.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SevaDaan shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages arising out of or in connection with your use of the Platform.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> terms@sevadaan.org<br />
            <strong>Address:</strong> SevaDaan Headquarters, Sector 5, Noida, Uttar Pradesh - 201301, India
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;


import Layout from '../components/common/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-lg mb-6">Last updated: June 20, 2025</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            SevaDaan ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
            use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us when you:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Create an account</li>
            <li>Fill out a form</li>
            <li>Make a donation</li>
            <li>Apply for volunteer opportunities</li>
            <li>Submit NGO registration</li>
            <li>Contact customer support</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We may use the information we collect for various purposes, including:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Provide, maintain, and improve our services</li>
            <li>Process donations and transactions</li>
            <li>Send administrative information</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Send promotional communications</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing of Information</h2>
          <p>
            We may share your information with third-party service providers who perform services on our behalf, 
            such as payment processing, data analysis, email delivery, and hosting services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Security</h2>
          <p>
            We implement appropriate technical and organizational measures designed to protect your information against 
            unauthorized access, loss, and alteration. However, no security system is impenetrable, and we cannot guarantee 
            the security of our systems or your information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information. You may also have the right to object to 
            or restrict certain types of processing of your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page and updating the "Last updated" date.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> privacy@sevadaan.org<br />
            <strong>Address:</strong> SevaDaan Headquarters, Sector 5, Noida, Uttar Pradesh - 201301, India
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;

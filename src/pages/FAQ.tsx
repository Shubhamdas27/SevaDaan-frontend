
import Layout from '../components/common/Layout';

const FAQ = () => {
  const faqs = [
    {
      question: "What is SevaDaan?",
      answer: "SevaDaan is a platform that connects NGOs, donors, and volunteers to create positive social impact across India. We help NGOs reach more people, donors find trusted causes to support, and volunteers find meaningful opportunities to contribute."
    },
    {
      question: "How are NGOs verified on the platform?",
      answer: "We have a rigorous verification process that includes document verification, legal status check, financial transparency assessment, physical verification (when possible), and ongoing monitoring. Only NGOs that meet our standards are listed on the platform."
    },
    {
      question: "How can I donate to an NGO?",
      answer: "You can donate by visiting an NGO's profile, selecting the 'Donate' option, choosing the amount you wish to contribute, and completing the secure payment process. We support various payment methods including credit/debit cards, UPI, net banking, and more."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes, donations to registered NGOs on our platform are generally tax-deductible under Section 80G of the Income Tax Act (for Indian taxpayers). You will receive a donation receipt that can be used for tax purposes."
    },
    {
      question: "How do I volunteer with an NGO?",
      answer: "Browse volunteer opportunities on our platform, apply for positions that match your skills and interests, and wait for the NGO to contact you. You can also create a volunteer profile to receive notifications about relevant opportunities."
    },
    {
      question: "How can NGOs join the platform?",
      answer: "NGOs can register by creating an account, providing required documentation (registration certificate, 80G certificate, FCRA if applicable, etc.), and completing our verification process. Once approved, they can create their profile and start using our tools."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, UPI, net banking, mobile wallets, and other popular payment methods in India. All transactions are secured with industry-standard encryption."
    },
    {
      question: "How much of my donation goes to the NGO?",
      answer: "We ensure that a minimum of 95% of your donation reaches the NGO. A small processing fee (2-5% depending on payment method) may be charged to cover payment gateway fees and platform maintenance."
    },
    {
      question: "Can I get a refund for my donation?",
      answer: "As donations are charitable contributions, they are generally non-refundable. However, in exceptional circumstances (like technical errors), please contact our support team within 48 hours of making the donation."
    },
    {
      question: "How can I create an account?",
      answer: "Click on the 'Register' button in the top-right corner, choose your role (donor, volunteer, or NGO representative), fill in the required information, and follow the verification process if applicable."
    }
  ];  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Find answers to common questions about SevaDaan</p>
        
        <div className="divide-y divide-gray-200 rounded-md border border-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 last:border-b-0">
              <details className="group">
                <summary className="flex w-full cursor-pointer items-center justify-between py-4 px-4 text-left font-medium">
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <svg 
                    className="h-5 w-5 text-gray-500 transition-transform duration-200 group-open:rotate-180" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
          <p className="mb-4">Our support team is here to help with any additional questions you might have.</p>
          <div className="flex flex-wrap gap-4">
            <a href="mailto:support@sevadaan.org" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Email Support
            </a>
            <a href="/contact" className="inline-flex items-center px-4 py-2 border border-blue-300 text-base font-medium rounded-md bg-white text-blue-700 hover:bg-blue-50">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;

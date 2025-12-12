import React from 'react';
import { formatCurrency, formatDate, formatReceiptNumber, calculateTaxBenefit } from '../../utils/formatters';

interface DonationReceiptProps {
  donation: {
    id: string;
    amount: number;
    currency: string;
    date: string;
    status: string;
    paymentMethod?: string;
    paymentId?: string;
    transactionId?: string;
    orderId?: string;
    isAnonymous: boolean;
    ngo: {
      id: string;
      name: string;
      address?: string;
      regNumber?: string;
      taxId?: string;
    };
    donor?: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      pan?: string;
    };
    program?: {
      name: string;
    };
  };
}

/**
 * Donation Receipt Component for printing and downloading
 * This component renders a printable receipt for a donation
 */
const DonationReceipt: React.FC<DonationReceiptProps> = ({ donation }) => {
  const receiptNumber = formatReceiptNumber(donation.id);
  const taxBenefit = calculateTaxBenefit(donation.amount);
  
  return (
    <div className="bg-white p-8 max-w-2xl mx-auto print:mx-0 print:w-full print:max-w-none">
      <div className="border-2 border-gray-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-green-700">SevaDaan NGO Platform</h1>
            <p className="text-sm text-gray-600">Tax-Exempt Donation Receipt</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">Receipt No: {receiptNumber}</p>
            <p className="text-sm text-gray-600">Date: {formatDate(donation.date)}</p>
          </div>
        </div>

        {/* NGO Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Received by:</h2>
          <p className="font-medium">{donation.ngo.name}</p>
          {donation.ngo.address && <p className="text-sm">{donation.ngo.address}</p>}
          {donation.ngo.regNumber && (
            <p className="text-sm text-gray-600">Registration Number: {donation.ngo.regNumber}</p>
          )}
          {donation.ngo.taxId && (
            <p className="text-sm text-gray-600">Tax ID: {donation.ngo.taxId}</p>
          )}
        </div>

        {/* Donor Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Received from:</h2>
          {donation.isAnonymous ? (
            <p className="italic text-gray-600">Anonymous Donor</p>
          ) : donation.donor ? (
            <>
              <p className="font-medium">{donation.donor.name}</p>
              <p className="text-sm">{donation.donor.email}</p>
              {donation.donor.phone && <p className="text-sm">{donation.donor.phone}</p>}
              {donation.donor.address && <p className="text-sm">{donation.donor.address}</p>}
              {donation.donor.pan && (
                <p className="text-sm text-gray-600">PAN: {donation.donor.pan}</p>
              )}
            </>
          ) : (
            <p className="italic text-gray-600">Donor information not available</p>
          )}
        </div>

        {/* Donation Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Donation Details:</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Amount</td>
                  <td className="px-4 py-2 text-right font-semibold">
                    {formatCurrency(donation.amount, donation.currency)}
                  </td>
                </tr>
                {donation.program && (
                  <tr>
                    <td className="px-4 py-2 text-sm text-gray-600">Program</td>
                    <td className="px-4 py-2 text-right">{donation.program.name}</td>
                  </tr>
                )}
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Payment Method</td>
                  <td className="px-4 py-2 text-right">{donation.paymentMethod || 'Online'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Transaction ID</td>
                  <td className="px-4 py-2 text-right font-mono text-sm">{donation.transactionId || donation.paymentId || donation.id}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-600">Tax Benefit (80G)</td>
                  <td className="px-4 py-2 text-right text-green-700 font-semibold">
                    {formatCurrency(taxBenefit, donation.currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            This donation is eligible for tax deduction under Section 80G of the Income Tax Act.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Thank you for your generous contribution!
          </p>
          
          <div className="mt-8 flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">
                Generated by SevaDaan NGO Platform
              </p>
            </div>
            <div className="text-right">
              <p className="border-t border-gray-400 pt-1 mt-6 text-sm">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

export default DonationReceipt;

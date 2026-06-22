import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuoteModal from '../components/QuoteModal';

const MainLayout = ({ children }) => {

  return (
    <div className="flex flex-col min-h-screen bg-onyx text-cream">
      {/* Fixed Navigation Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-grow pt-12">
        {children}
      </main>

      {/* Multi-column Footer */}
      <Footer />

      {/* Persistent Quote Request Form Modal */}
      <QuoteModal />
    </div>
  );
};

export default MainLayout;

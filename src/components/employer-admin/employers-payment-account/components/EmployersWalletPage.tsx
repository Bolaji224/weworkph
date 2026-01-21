import React, { useState } from 'react';
import EmployersWalletCard from './WalletCard';
import AddFundsModal from './AddFundModal';
import { iProfileCompany } from '../../../../models/profle';

interface Props {
  profile: iProfileCompany;
}

const EmployersWalletPage: React.FC<Props> = ({ profile }) => {
  const [showAddFunds, setShowAddFunds] = useState(false);

  return (
    <div>
      <EmployersWalletCard
        profile={profile}
        onAddFundsClick={() => setShowAddFunds(true)} // opens modal
        onWithdrawClick={() => console.log("Withdraw clicked")}
      />

      {showAddFunds && (
        <AddFundsModal
          profile={profile}
          onClose={() => setShowAddFunds(false)} // closes modal
          paymentDone={() => {
            console.log("Payment successful!");
            setShowAddFunds(false); // close modal after payment
          }}
        />
      )}
    </div>
  );
};

export default EmployersWalletPage;

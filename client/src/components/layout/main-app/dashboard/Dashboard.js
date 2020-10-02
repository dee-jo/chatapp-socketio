import React, { useState } from 'react';
import * as classes from './Dashboard.css';
import JoinRequestsPending from './join-requests/JoinRequestsPending';
import JoinRequestsApproved from './join-requests/JoinRequestsApproved';

const Dashboard = ({
  joinRequestsPending,
  joinRequestsApproved,
}) => {


  return (
    <div className='searchContainer'>
      <JoinRequestsPending joinRequestsPending={joinRequestsPending} />
      <JoinRequestsApproved joinRequestsApproved={joinRequestsApproved} />
    </div>
  )
}

export default Dashboard;
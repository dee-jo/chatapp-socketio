import React from 'react';

const JoinRequestsApproved = ({joinRequestsApproved}) => {

  return (
    <>
      <div>In JoinRequestsApproved</div>
      {joinRequestsApproved && joinRequestsApproved.map(rq => <div>{rq}</div>)}
    </>
  )
}

export default JoinRequestsApproved;
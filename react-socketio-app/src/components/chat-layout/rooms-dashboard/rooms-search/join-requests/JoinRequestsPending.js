import React from 'react';

const JoinRequestsPending = ({joinRequestsPending}) => {

  return (
    <>
      <div>In JoinRequestsPending</div>
      {joinRequestsPending && joinRequestsPending.map(rq => <div>{rq}</div>)}
    </>
  )
}

export default JoinRequestsPending;
import _ from 'lodash'
import React, { useState } from 'react';
import { Button, Dropdown, Modal } from 'semantic-ui-react' 
import RequestModal from './RequestModal';
import * as classes from './RoomsSearch.css'

const RoomsSearch = ({
  availableRooms, 
  onJoinRoomsRequest, 
  joinRequestSent, 
  setJoinRequestSent
}) =>  {

  const getOptions = () => {
    console.log('[RoomsSearch], availableRooms: ', availableRooms);
    const mult = availableRooms.length;
      return availableRooms.map(room => {
        return { key: room, text: room, value: _.snakeCase(room) }
      })
  }

  const [ isFetching, setIsFetching ] = useState(false);
  const [ multiple, setMultiple ] = useState(true);
  const [ search, setSearch ] = useState(true);
  const [ searchQuery, setSearchQuery ] = useState(null);
  const [ value, setValue ] = useState([]);
  const [ options, setOptions ] = useState(getOptions()); 


  const [ open, setOpenModal] = useState(true);

  const state = {
    isFetching,
    multiple,
    search,
    searchQuery,
    value,
    options
  }

  console.log('availableRooms', availableRooms);
  
  // console.log('search value: ', value);

  const handleChange = (e, { value }) => setValue( value )
  const handleSearchChange = (e, { searchQuery }) => setSearchQuery( searchQuery )

  const onSubmitJoinRequest = () => {
    onJoinRoomsRequest(value);
  }

  // const fetchOptions = () => {
  //   setIsFetching(true);

  //   setTimeout(() => {
  //     setIsFetching(false);
  //     setOptions(getOptions());
  //     // selectRandom()
  //   }, 500)
  // }

  const onButtonClick = () => {
    setJoinRequestSent(false);
    setOpenModal(false);
    setOptions(getOptions);
  }

  const renderModal = (open) => (

    // <RequestModal openModal={open} setJoinRequestSent={setJoinRequestSent} />
    
    <Modal
      size='mini'
      open={open}
      onClose={onButtonClick} >
      <Modal.Header>Join Request Successful!</Modal.Header>
      <Modal.Content>
        <p>You have requested to join the following rooms: </p>
        {joinRequestSent && joinRequestSent.requestedRooms.map(room => (<p>{room}</p>))}
        <p>You'll be notified once the room admin accepts your request.</p>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={onButtonClick}>
          Ok
        </Button>
      </Modal.Actions>
    </Modal>
  )

    const modalOpen = joinRequestSent ? true : false;
    console.log('joinRequestSent: ', joinRequestSent, 'modalOpen: ', modalOpen);
    return (
      <>
      {renderModal(modalOpen)}
      {/* <RequestModal openModal={modalOpen} setJoinRequestSent={setJoinRequestSent} /> */}
      <div className='roomSearch'>
         <div className='buttonWrapper'>
          <Button fluid 
                  className='joinButton'
                  disabled={!value.length}
                  onClick={onSubmitJoinRequest} >
                    {value.length ? 'Request To Join Selected Rooms' : 'Select rooms you wish to join'}
          </Button>
        </div>
        <div>
          <Dropdown
            fluid
            selection
            multiple={multiple}
            search={search}
            options={options}
            value={value}
            placeholder='Select rooms'
            onChange={handleChange}
            onSearchChange={handleSearchChange}
            disabled={isFetching}
            loading={isFetching}
          />
        </div>
      </div>
      </>
    )
}

export default RoomsSearch;

import _, { forEach } from 'lodash'
import faker from 'faker'
import React, { useState } from 'react';
import { Button, Dropdown, Divider } from 'semantic-ui-react' 
import * as classes from './RoomsSearch.css'

 

const RoomsSearch = ({availableRooms}) =>  {

  const getOptions = () => {
    const mult = availableRooms.length;
      return availableRooms.map(room => {
        return { key: room, text: room, value: _.snakeCase(room) }
      })
  }
  
   
  // const getOptions = () => {
  //   let i = 0;
  //   _.times(availableRooms.length, i, () => {
  //     const room = availableRooms[i-1];
  //     return { key: room, text: room, value: _.snakeCase(room)}
  //   })
  //   // availableRooms.forEach((room) => {
  //   //   return { key: room, text: room, value: _.snakeCase(room)}
  //   // })
  // }

  const [ isFetching, setIsFetching ] = useState(false);
  const [ multiple, setMultiple ] = useState(true);
  const [ search, setSearch ] = useState(true);
  const [ searchQuery, setSearchQuery ] = useState(null);
  const [ value, setValue ] = useState([]);
  const [ options, setOptions ] = useState(getOptions()); 

  const state = {
    isFetching,
    multiple,
    search,
    searchQuery,
    value,
    options
  }
  
  // console.log('search value: ', value);

  const handleChange = (e, { value }) => setValue( value )
  const handleSearchChange = (e, { searchQuery }) => setSearchQuery( searchQuery )

  const fetchOptions = () => {
    setIsFetching(true);

    setTimeout(() => {
      setIsFetching(false);
      setOptions(getOptions());
      // selectRandom()
    }, 500)
  }

  // const selectRandom = () => {
  //   const value = _.sample(options).value
  //   setValue( multiple ? [value] : value )
  // }

  // const toggleSearch = (e) => setSearch(e.target.checked)

  // const toggleMultiple = (e) => {
  //   const multiple = e.target.checked
  //   const newValue = multiple ? _.compact([value]) : _.head(value) || ''
  //   setMultiple(multiple)
  //   setValue(newValue)
  // }

    return (
      <div className='roomSearch'>
         <div className='buttonWrapper'>
          <Button fluid 
                  className='joinButton'
                  disabled={!value.length}>
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

    )
      
      {/* // <Grid>
      //   <Grid.Column width={8}>
      //   </Grid.Column>
      //   <Grid.Column width={8}>
      //     <Header>State</Header>
      //     <pre>{JSON.stringify(state, null, 2)}</pre>
      //   </Grid.Column>
      // </Grid> */}

       {/* <p>
          <Button onClick={fetchOptions}>Fetch</Button>
          <Button onClick={selectRandom} disabled={_.isEmpty(options)}>
            Random
          </Button>
          <label>
            <input
              type='checkbox'
              checked={search}
              onChange={toggleSearch}
            />{' '}
            Search
          </label>{' '}
          <label>
            <input
              type='checkbox'
              checked={multiple}
              onChange={toggleMultiple}
            />{' '}
            Multiple
          </label>
        </p> */}
    
}

export default RoomsSearch;

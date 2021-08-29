import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './IotDeviceData.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import {TextField} from '@material-ui/core';
import {Notification} from '../Notification/Notification';
import {ToastContainer} from 'react-toastify';

const IotDeviceData = () => {
  // response we get from api is stored in data state
  const [data, setData] = useState([]);

  // function that get data from the api when the component is rendered and store that in the state
  const getData = async () => {
    await axios
      .get('http://localhost:8888/devices')
      .then((response) => {
        setData(response.data.data);
      })
      .catch(() =>
        Notification('Error is loading data please refresh the page')
      );
  };
  useEffect(() => {
    getData();
  }, []);

  // For finding active devices
  const findActiveDevices = () => data.filter((d) => d.active).length;

  // For finding in-active devices
  const findInActiveDevices = () => data.filter((d) => !d.active).length;

  // For searching device by name
  const searchByName = (text) => {
    if (text) {
      const newData = data.filter((d) => d.name.includes(text));
      setData(newData);
    } else {
      getData();
    }
  };

  // For handling toggle (turning on and off machine request)
  const handleToggle = async (data) => {
    const stateValue = !data.active;
    await axios
      .patch(`http://localhost:8888/devices/${data.name}?active=${stateValue}`)
      .then(() => {
        getData();
        Notification(
          stateValue ? `Turned on ${data.name}` : `Turned off  ${data.name}`
        );
      })
      .catch(() =>
        Notification(
          stateValue
            ? `Error in turning on ${data.name} please try again`
            : `Error in turning off  ${data.name}  please try again`
        )
      );
  };

  return (
    <>
      <ToastContainer />
      <div className='mainWrapper'>
        <div className='topValuesWrapper'>
          <h1 className='topValues'>Total Devices: {data.length}</h1>
          <h1 className='topValues'>Active Devices: {findActiveDevices()}</h1>
          <h1 className='topValues'>
            InActive Devices: {findInActiveDevices()}
          </h1>
        </div>
        <div className='textFieldWrapper'>
          <TextField
            id='outlined-secondary'
            label='Search by name'
            variant='outlined'
            color='primary'
            onChange={(e) => searchByName(e.currentTarget.value)}
          />
        </div>
        <Paper className='container'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell numeric>Unit</TableCell>
                <TableCell numeric>Value</TableCell>
                <TableCell numeric>Timestamp</TableCell>
                <TableCell numeric>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((d, i) => (
                <TableRow key={i}>
                  <TableCell component='th' scope='row'>
                    {d.name}
                  </TableCell>
                  <TableCell numeric>{d.unit}</TableCell>
                  <TableCell numeric>{d.value}</TableCell>
                  <TableCell numeric>{d.timestamp}</TableCell>
                  <TableCell numeric>
                    <Switch
                      checked={d.active}
                      onChange={() => handleToggle(d)}
                      color='primary'
                      name='active'
                      inputProps={{'aria-label': 'secondary checkbox'}}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </>
  );
};

export {IotDeviceData};

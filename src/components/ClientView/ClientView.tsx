import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { Tooltip, Fab, makeStyles } from '@material-ui/core';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MUIDataTable from 'mui-datatables';
import IUser from '../../interfaces/User';

const useStyles = makeStyles((theme) => ({
  addFab: {
    margin: theme.spacing(1),
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'absolute',
  }
}));

export default function ClientView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const [clientsListData, setClientsListData] = useState<string[][]>([]);

  const getTechniciansQuery = gql`
    query {
      getTechnicians {
        uid
        firstName
        middleName
        lastName
        email
        phone
        company
        isTechnician
      }
    }
  `;
  useQuery(getTechniciansQuery, {
    onCompleted: (data: { getTechnicians: IUser[] }) => {
      const formattedData = data?.getTechnicians?.map((user: IUser): string[] => {
        return [
          user.firstName || '',
          user.middleName || '',
          user.lastName || '',
          user.email || 'No Email',
          user.phone || 'No Phone Number',
          user.company || '',
          user.isTechnician ? 'Yes' : 'No',
        ];
      });
      setClientsListData(formattedData);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  const columns = [
    {
      name: 'firstName',
      label: 'First Name',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'middleName',
      label: 'Middle Name',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'lastName',
      label: 'Last Name',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'email',
      label: 'Email',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'phone',
      label: 'Phone Number',
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: 'company',
      label: 'Company',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'isTechnician',
      label: 'Is Technician',
      options: {
        filter: true,
        sort: false,
      }
    }
  ];

  return (
    <div>
      <MUIDataTable
        data={clientsListData}
        columns={columns}
        title='Clients List'
        options={{
          filterType: 'multiselect',
          print: false,
          download: false,
        }}
      />
      <Tooltip title='New Ticket'>
        <Fab className={classes.addFab}
          aria-label='add'
          color='primary'
          onClick={() => history.push('/client/new')}>
          <PersonAddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}
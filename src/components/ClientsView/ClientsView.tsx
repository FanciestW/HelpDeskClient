import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { Tooltip, Fab, makeStyles } from '@material-ui/core';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MUIDataTable from 'mui-datatables';
import IUser from '../../interfaces/User';
import { IRootReducer } from '../../redux/IRootReducer';

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

export default function ClientsView() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { uid }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);

  const [techniciansList, setTechniciansList] = useState<string[][]>([]);

  const getClientsQuery = gql`
query {
  getClients {
    uid
    firstName
    middleName
    lastName
    email
    phone
    company
  }
}
`;
  const { refetch } = useQuery(getClientsQuery, {
    onCompleted: (data: { getClients?: IUser[] }) => {
      const formattedData = data?.getClients?.map((user: IUser): string[] => {
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
      setTechniciansList(formattedData || []);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [uid]);

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
    }
  ];

  return (
    <div>
      <MUIDataTable
        data={techniciansList}
        columns={columns}
        title='Clients List'
        options={{
          filterType: 'multiselect',
          print: false,
          download: false,
        }}
      />
      <Tooltip title='Add Client'>
        <Fab className={classes.addFab}
          aria-label='add'
          color='primary'
          onClick={() => history.push('/requests/new')}>
          <PersonAddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}
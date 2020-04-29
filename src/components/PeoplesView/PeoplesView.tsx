import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Tooltip,
  Fab,
  makeStyles,
} from '@material-ui/core';
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

export default function PeoplesView(props: IPeoplesViewProps) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { uid, isTechnician }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);

  const [peoplesListData, setPeoplesListData] = useState<string[][]>([]);
  const [requestDialogOpen, setRequestDialogOpen] = useState<boolean>(false);

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
      }
    }
  `;
  const { refetch } = useQuery(props.show === 'clients' ? getClientsQuery : getTechniciansQuery, {
    onCompleted: (data: { getClients?: IUser[]; getTechnicians?: IUser[] }) => {
      const peopleData = props.show === 'clients' ? data?.getClients : data?.getTechnicians;
      const formattedData = peopleData?.map((user: IUser): string[] => {
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
      setPeoplesListData(formattedData || []);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
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

  if (!isTechnician && props.show === 'clients') {
    return (<Redirect to='/technicians' />);
  } else {
    return (
      <div>
        <MUIDataTable
          data={peoplesListData}
          columns={columns}
          title={props.show === 'clients' ? 'Clients List' : 'Technicians List'}
          options={{
            filterType: 'multiselect',
            print: false,
            download: false,
            rowsPerPageOptions: [10, 20, 50],
          }}
        />
        <Dialog open={requestDialogOpen} onClose={() => setRequestDialogOpen(false)} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Send {props.show === 'clients' ? 'Client' : 'Technician'} Request</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To send a connection request, please enter your email address here. We will send your request.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRequestDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={() => setRequestDialogOpen(false)} color="primary">
              Send Request
            </Button>
          </DialogActions>
        </Dialog>
        <Tooltip title={props.show === 'clients' ? 'Add Client' : 'Add Technician'}>
          <Fab className={classes.addFab}
            aria-label='add'
            color='primary'
            onClick={() => setRequestDialogOpen(true)}>
            <PersonAddIcon />
          </Fab>
        </Tooltip>
      </div>
    );
  }
}

interface IPeoplesViewProps {
  show: 'clients' | 'technicians';
}

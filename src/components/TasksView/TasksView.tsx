import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { Fab, Tooltip, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import ITask from '../../interfaces/Task';
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

export default function TasksView() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [ticketsData, setTicketsData] = useState<string[][]>([]);
  const { uid }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user) || {};

  const getTasksQuery = gql`
    query {
      getTasks {
        taskId
        title
        description
        createdBy {
          uid
          firstName
          lastName
        }
        assignedTo {
          uid
          firstName
          lastName
        }
        status
        priority
        dueDate
      }
    }
  `;

  const { refetch } = useQuery(getTasksQuery, {
    onCompleted: (data: { getTasks: ITask[] }) => {
      console.log({ data, });
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'createdBy',
      label: 'Created By',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'assignedTo',
      label: 'Assigned To',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'priority',
      label: 'Priority',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      options: {
        filter: false,
        sort: true,
      }
    }
  ];

  return (
    <div>
      <MUIDataTable
        title='All Tickets'
        data={ticketsData}
        columns={columns}
        options={{
          filterType: 'multiselect',
          print: false,
          download: false,
          rowsPerPageOptions: [5, 10, 20, 50],
          onRowClick: onTicketRowClick,
        }}
      />
      <Tooltip title='New Ticket'>
        <Fab className={classes.addFab}
          aria-label='add'
          color='primary'
          onClick={() => history.push('/ticket/new')}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

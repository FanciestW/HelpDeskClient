import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import { Fab, Tooltip, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import ITicket from '../../interfaces/Ticket';
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

export default function TicketView() {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

  const [ticketsData, setTicketsData] = useState<string[][]>([]);
  const { uid }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user) || {};
  
  const query = gql`
    query {
      getTickets {
        ticketId
        title
        description
        createdBy {
          uid
          firstName
          lastName
          email
        }
        assignedTo {
          uid
          firstName
          lastName
          email
        }
        status
        priority
        dueDate
      }
    }
  `;
  const { refetch } = useQuery(query, {
    onCompleted: (data: { getTickets: ITicket[] }) => {
      const formattedData = data?.getTickets?.map((tix: ITicket): string[] => {
        let ticketDueDate = 'No Date';
        try {
          ticketDueDate = Intl.DateTimeFormat('en-US').format(new Date(tix.dueDate || '')).toString();
        } catch (err) {
          ticketDueDate = 'No Date';
        }
        return [
          tix.title ? `${tix.title?.substring(0, 40)}${tix.title.length > 40 ? '...' : ''}` : '',
          tix.description ? `${tix.description?.substring(0, 80)}${tix.description.length > 80 ? '...' : ''}` : '',
          tix.createdBy ? `${tix.createdBy?.firstName} ${tix.createdBy?.lastName}` : 'N/A',
          tix.assignedTo ? `${tix.assignedTo?.firstName} ${tix.assignedTo?.lastName}` : 'Unassigned',
          tix.status || 'N/A',
          tix.priority?.toString() || 'N/A',
          ticketDueDate,
        ];
      });
      setTicketsData(formattedData);
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
        sort: true,
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
        sort: true
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
          rowsPerPageOptions: [10, 20, 50],
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
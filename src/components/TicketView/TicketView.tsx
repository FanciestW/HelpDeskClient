import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import { Fab, Tooltip, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import ITicket from '../../interfaces/Ticket';

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
  const [ticketsData, setTicketsData] = useState([['']]);
  const dispatch = useDispatch();
  const history = useHistory();
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
  const classes = useStyles();
  useQuery(query, {
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
      if ((error.networkError as ServerParseError).statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: false,
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
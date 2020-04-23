import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import MUIDataTable from 'mui-datatables';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import ITicket from '../../interfaces/Ticket';

export default function TicketView() {
  const dispatch = useDispatch();
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
  const [ticketsData, setTicketsData] = useState([['']]);
  useQuery(query, {
    onCompleted: (data: { getTickets: ITicket[]}) => {
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
          tix.assignedTo ? `${tix.assignedTo?.firstName} ${tix.assignedTo?.lastName}`: 'Unassigned',
          tix.status || 'N/A',
          tix.priority?.toString() || 'N/A',
          ticketDueDate,
        ];
      });
      setTicketsData(formattedData);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
        dispatch(changeAuthed(false));
      }
    },
  });

  const columns = ['Title', 'Description', 'Created By', 'Assigned To', 'Status', 'Priority', 'DueDate'];

  return (
    <div>
      <MUIDataTable
        title='All Tickets'
        data={ticketsData}
        columns={columns}
        options={{ filterType: 'checkbox' }}
      />
    </div>
  );
}
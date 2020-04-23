import React from 'react';
import { useDispatch } from 'react-redux';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { changeAuthed } from '../../redux/actions/AuthedActions'

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
  const [ticketsData, setTicketsData] = React.useState([]);
  useQuery(query, {
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
        dispatch(changeAuthed(false));
      }
    },
    onCompleted: (data) => {
      setTicketsData(data.getTickets);
    }
  });

  return (
    <h1>Tickets</h1>
  );
}
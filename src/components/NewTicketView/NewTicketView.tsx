import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
import ITicket from '../../interfaces/Ticket';

export default function NewTicketView() {
  const dispatch = useDispatch();
  
  const newTicketMutation = gql`
    mutation NewTicket(
      $title: String!,
      $description: String,
      $assignedTo: String,
      $status: String,
      $priority: Int!,
      $dueDate: String
    ) {
      newTicket(
        title: $title,
        description: $description,
        assignedTo: $assignedTo,
        status: $status,
        priority: $priority,
        dueDate: $dueDate
      ) {
        ticketId
      }
    }
  `;
  const [newTicket, { data }] = useMutation(newTicketMutation);
}

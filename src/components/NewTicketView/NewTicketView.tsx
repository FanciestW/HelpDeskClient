import React, { useState } from 'react';
import {
  Grid,
  Typography,
  InputLabel,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch } from 'react-redux';
import { useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
import ITicket from '../../interfaces/Ticket';
import { changeAuthed } from '../../redux/actions/AuthedActions';

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

//TODO::Add states and mutation call.

export default function NewTicketView() {
  const [newTicketRes] = useState({});
  const classes = useStyles();
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };
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
  useMutation(newTicketMutation, {
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  const statuses = ['new', 'pending', 'started', 'in progress', 'done', 'deleted', 'archived'];
  const statusLabels = ['New', 'Pending', 'Started', 'In Progress', 'Done', 'Deleted', 'Archived'];
  const priorities = [1, 2, 3, 4, 5];
  return (
    <React.Fragment>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h6' gutterBottom>
            New Ticket Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required
                variant='outlined'
                id='title'
                name='title'
                label='Title'
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                id='description'
                name='description'
                label='Description'
                rows={6}
                multiline
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                id='assignedTo'
                name='assignedTo'
                label='Assigned To'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select required
                  id='status'
                  name='status'
                  labelId='status-label'
                  label='Status'
                  fullWidth
                >
                  {
                    statuses.map((stat, index) => {
                      return (
                        <MenuItem key={index} value={stat}>
                          {statusLabels[index]}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='priority-label'>Priority</InputLabel>
                <Select required
                  id='priority'
                  name='priority'
                  labelId='priority-label'
                  label='Priority'
                  fullWidth
                >
                  {
                    priorities.map((priority, index) => {
                      return (
                        <MenuItem key={index} value={priority}>
                          {priority}
                        </MenuItem>
                      );
                    })
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableToolbar
                  variant='inline'
                  inputVariant='outlined'
                  format='MM/dd/yyyy'
                  margin='normal'
                  id='date-picker-inline'
                  label='Due Date'
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </React.Fragment>
  );
}

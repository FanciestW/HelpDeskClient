import React, { useState } from 'react';
import {
  Button,
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
import { useQuery, useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
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
  title: {
    textAlign: 'center',
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState(null);

  const classes = useStyles();
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
          <Typography className={classes.title} variant='h4' gutterBottom>
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select required
                  id='status'
                  name='status'
                  labelId='status-label'
                  label='Status'
                  defaultValue='new'
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
            <Grid item xs={12} sm={6}>
              <TextField
                variant='outlined'
                id='assignedTo'
                name='assignedTo'
                label='Assigned To'
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableToolbar
                  disablePast
                  emptyLabel='No Due Date'
                  variant='inline'
                  inputVariant='outlined'
                  format='MM/dd/yyyy'
                  margin='none'
                  id='date-picker-inline'
                  label='Due Date'
                  value={dueDate}
                  onChange={(date: any) => setDueDate(date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Save
            </Button>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  );
}

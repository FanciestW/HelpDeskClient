import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
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
import { useHistory } from 'react-router-dom';
import { Autocomplete } from '@material-ui/lab';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
import IUser from '../../interfaces/User';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import { IRootReducer } from '../../redux/IRootReducer';

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
  progress: {
    color: '#FFFFFF',
  }
}));

export default function NewTaskView() {
  const [techniciansList, setTechniciansList] = useState<IUser[] | []>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const currentUser: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const technicianListQuery = gql`
    query {
      getTechnicians {
        uid
        firstName
        lastName
        email
      }
    }
  `;

  const { loading: loadingTechniciansList } = useQuery(technicianListQuery, {
    onCompleted: (data: { getTechnicians: IUser[] }) => {
      const { uid, firstName, lastName, email } = currentUser;
      const technicianList = [...data.getTechnicians, { uid, firstName, lastName, email }];
      setTechniciansList(technicianList);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  const newTaskMutation = gql`
    mutation NewTask(
      $title: String!,
      $description: String,
      $assignedTo: String,
      $status: String,
      $priority: Int!,
      $dueDate: String
    ) {
      newTask(
        title: $title,
        description: $description,
        assignedTo: $assignedTo,
        status: $status,
        priority: $priority,
        dueDate: $dueDate
      ) {
        taskId
      }
    }
  `;
  const [addNewTask, { loading: addTaskLoading }] = useMutation(newTaskMutation, {
    onCompleted: () => {
      history.goBack();
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  const handleNewTask = () => {
    addNewTask({
      variables: {
        title,
        description,
        assignedTo,
        status,
        priority,
        dueDate: dueDate?.toISOString(),
      }
    });
  };

  const statuses = ['new', 'pending', 'started', 'in progress', 'done', 'deleted', 'archived'];
  const statusLabels = ['New', 'Pending', 'Started', 'In Progress', 'Done', 'Deleted', 'Archived'];
  const priorities = [1, 2, 3, 4, 5];

  return (
    <React.Fragment>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography className={classes.title} variant='h4' gutterBottom>
            New Task
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField required
                variant='outlined'
                id='title'
                name='title'
                label='Title'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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
                value={description}
                onChange={(event) => setDescription(event.target.value)}
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
                  value={status}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => setStatus(event.target.value as string)}
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
                  value={priority}
                  onChange={(event: React.ChangeEvent<{ value: unknown }>) => setPriority(event.target.value as string)}
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
              <Autocomplete
                fullWidth
                autoSelect
                autoHighlight
                loading={loadingTechniciansList}
                id='status-combo-box'
                onChange={(_: any, value: any) => setAssignedTo(value.uid)}
                options={techniciansList}
                getOptionLabel={(option: IUser) => `${option.firstName} ${option.lastName}`}
                renderInput={(params) => <TextField
                  {...params}
                  variant='outlined'
                  id='assignedTo'
                  name='assignedTo'
                  label='Assigned To'
                  fullWidth
                />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableToolbar
                  minDate={new Date()}
                  minDateMessage='Oh no! This task is overdue'
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
              onClick={handleNewTask}
            >
              {addTaskLoading ? <CircularProgress className={classes.progress} /> : 'Save'}
            </Button>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  );
}

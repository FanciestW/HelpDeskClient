import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { useQuery, useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import { IRootReducer } from '../../redux/IRootReducer';
import IUser from '../../interfaces/User';
import ITask from '../../interfaces/Task';

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

export default function TaskDetailView() {
  const [techniciansList, setTechniciansList] = useState<IUser[] | []>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedToUid, setAssignedToUid] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);

  const { taskId } = useParams();

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user);

  const taskQuery = gql`
    query GetATask($taskId: ID!) {
      getATask(taskId: $taskId) {
        title
        description
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
  const { refetch: refetchTaskData, loading: loadingTaskData } = useQuery(taskQuery, {
    variables: {
      taskId,
    },
    onCompleted: (data: { getATask: ITask }) => {
      setTitle(data.getATask?.title ?? '');
      setDescription(data.getATask?.description ?? '');
      setAssignedToUid(data.getATask?.assignedTo?.uid ?? '');
      setStatus(data.getATask?.status ?? 'new');
      setPriority(data.getATask?.priority?.toString() ?? '5');
      setDueDate(new Date(data.getATask?.dueDate ?? ''));
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  useEffect(() => {
    refetchTaskData();
  }, [taskId]);

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

  const updateTaskMutation = gql`
    mutation UpdateTask(
      $taskId: ID!,
      $title: String!,
      $description: String,
      $assignedTo: String,
      $status: String,
      $priority: Int!,
      $dueDate: String
    ) {
      updateTask(
        taskId: $taskId,
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
  const [updateTask, { loading: updateTaskLoading }] = useMutation(updateTaskMutation, {
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

  const handleTaskUpdate = () => {
    updateTask({
      variables: {
        taskId,
        title,
        description,
        assignedTo: assignedToUid,
        status,
        priority,
        dueDate: dueDate?.toISOString(),
      }
    });
  };

  const getAssignedToData = () => {
    if (!loadingTaskData && !loadingTechniciansList) {
      return techniciansList.find((user) => user.uid === assignedToUid);
    } else {
      return null;
    }
  };

  const statuses = ['new', 'pending', 'started', 'in progress', 'done', 'deleted', 'archived'];
  const statusLabels = ['New', 'Pending', 'Started', 'In Progress', 'Done', 'Deleted', 'Archived'];
  const priorities = [1, 2, 3, 4, 5];

  return (
    <React.Fragment>
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography className={classes.title} variant='h4' gutterBottom>
            Task Details
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
                onChange={(_: any, value: any) => setAssignedToUid(value.uid)}
                options={techniciansList}
                getOptionLabel={(option: IUser) => `${option.firstName} ${option.lastName}`}
                value={getAssignedToData()}
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
                  invalidLabel='Testing'
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
              onClick={handleTaskUpdate}
            >
              {updateTaskLoading ? <CircularProgress className={classes.progress} /> : 'Update'}
            </Button>
          </div>
        </Paper>
      </div>
    </React.Fragment>
  );
}

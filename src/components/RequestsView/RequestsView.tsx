import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useMutation, gql, ApolloError, ServerParseError } from '@apollo/client';
import {
  Checkbox,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  DoneRounded as DoneIcon,
  CloseRounded as CloseIcon
} from '@material-ui/icons';
import IUser from '../../interfaces/User';
import IConnectionRequest from '../../interfaces/ConnectionRequest';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import { IRootReducer } from '../../redux/IRootReducer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  gridItem: {
    width: '80vw',
    maxWidth: 800,
    padding: theme.spacing(1),
  },
  list: {
    backgroundColor: theme.palette.background.paper,
  },
  listItemButton: {
    padding: theme.spacing(2),
  }
}));

export default function RequestsView() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [checked, setChecked] = useState<IConnectionRequest[]>([]);
  const [requestsData, setRequestsData] = useState<IConnectionRequest[]>([]);

  const { uid }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user) || {};

  const getRequestsQuery = gql`
    query {
      getReceivedRequests {
        requestId
        requesterUid
        requester {
          uid
          firstName
          lastName
          email
          isTechnician
        }
      }
    }
  `;
  const { refetch } = useQuery(getRequestsQuery, {
    onCompleted: (data: { getReceivedRequests: IConnectionRequest[] }) => {
      setRequestsData(data.getReceivedRequests);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  const acceptRequestMutation = gql`
    mutation AcceptRequest($requesterUid: String!) {
      acceptRequest(requesterUid: $requesterUid) {
        requestId
        status
      }
    }
  `;
  const [acceptRequest] = useMutation(acceptRequestMutation, {
    onCompleted: (data: { acceptRequest: IConnectionRequest }) => {
      const deleteIndex = requestsData.findIndex((request) => request.requestId === data.acceptRequest.requestId);
      if (deleteIndex >= 0) {
        const arrayCopy = [...requestsData];
        arrayCopy.splice(deleteIndex, 1);
        setRequestsData(arrayCopy);
      }
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

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const handleAcceptRequest = (requesterUid?: string) => {
    if (requesterUid) {
      acceptRequest({
        variables: {
          requesterUid,
        }
      });
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction='column'
      alignItems='center'
      justify='center'
      className={classes.root}
    >
      <Grid item className={classes.gridItem}>
        {requestsData.length <= 0 ?
          <Typography variant='h4' style={{textAlign: 'center'}}>No Requests</Typography> :
          <List className={classes.list}>
            {requestsData.map((value, index) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={index} role={undefined} dense button onClick={handleToggle(value)}>
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`${value.requester?.firstName} ${value.requester?.lastName}`}
                    secondary={`${value.requester?.isTechnician ? 'Technician' : 'Client'} - ${value.requester?.email}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title='Reject'>
                      <IconButton
                        className={classes.listItemButton}
                        edge='end'
                        aria-label='comments'>
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Accept'>
                      <IconButton
                        className={classes.listItemButton}
                        onClick={() => handleAcceptRequest(requestsData[index]?.requesterUid)}
                        edge='end'
                        aria-label='comments'>
                        <DoneIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        }
      </Grid>
    </Grid>
  );
}

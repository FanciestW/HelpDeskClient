import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DashboardCard from '../DashboardCard/DashboardCard';
import { changeAuthed } from '../../redux/actions/AuthedActions';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10
  },
  paper: {
    height: 280,
    width: 240,
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [cardData, setCardData] = useState(['N/A', 'N/A', 'N/A']);

  const query = gql`
    query {
      getOpenTickets {
        ticketId
      }
      getUpcomingTasks {
        taskId
      }
      getClients {
        uid
      }
    }
  `;
  useQuery(query, {
    onCompleted: (data) => {
      setCardData([
        data?.getOpenTickets?.length?.toString() || 'N/A',
        data?.getUpcomingTasks?.length?.toString() || 'N/A',
        data?.getClients?.length?.toString() || 'N/A',
      ]);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError).statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    },
  });

  // Static UI Component Text for Dashboard Card Components.
  const cardTitles = ['Open Tickets', 'Upcoming Tasks', 'Clients'];
  const cardButtonText = ['See Open Tickets', 'See Tasks', 'Clients List'];
  const cardButtonDestination = ['/tickets', '/tasks', '/clients'];

  return (
    <div className={classes.root}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {cardTitles.map((title, index) => {
              return (
                <Grid key={index} item>
                  <DashboardCard title={title}
                    data={cardData[index]}
                    buttonText={cardButtonText[index]}
                    buttonDestination={cardButtonDestination[index]} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DashboardCard from '../DashboardCard/DashboardCard';

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
  const classes = useStyles();
  const cardTitles = ['Open Tickets', 'Upcoming Tasks', 'Clients'];
  const cardButtonText = ['See Open Tickets', 'See Tasks', 'Clients List'];
  const cardButtonDestination = ['google.com', 'github.com', 'linkedin.com'];

  useEffect(() => {
  }, []);


  const query = gql`
    query {
      getOpenTickets {
        ticketId
      }
      getUpcomingTasks {
        taskId
      }
    }
  `;
  const { loading, error, data } = useQuery(query);

  const cardData = [
    loading && !error ? 'N/A' : data?.getOpenTickets?.length?.toString(),
    loading && !error ? 'N/A' : data?.getUpcomingTasks?.length?.toString(),
    loading && !error ? 'N/A' : 12
  ];
  if (error) {
    console.log(error);
  }
  if (!loading) {
    console.log(data);
  }
  return (
    <div className={classes.root}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={2}>
            {cardTitles.map((title, index) => {
              return (
                <Grid key={index} item>
                  <DashboardCard title={title}
                    data={cardData[index] || null}
                    buttonText={cardButtonText[index] || null}
                    buttonDestination={cardButtonDestination[index] || null} />
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
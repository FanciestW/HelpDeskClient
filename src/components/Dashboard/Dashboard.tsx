import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DashboardCard from '../DashboardCard/DashboardCard';

const mockData = {
  openCases: 2,
  openTasks: 5,
  numberOfClients: 12,
};

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
  const cardTitles = ['Open Cases', 'Upcoming Tasks', 'Clients'];
  const cardData = [2, 5, 12];
  const cardButtonText = ['See Open Tickets', 'See Tasks', 'Clients List'];
  const cardButtonDestination = ['google.com', 'github.com', 'linkedin.com'];
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
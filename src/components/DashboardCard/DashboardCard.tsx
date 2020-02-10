import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardActions, CardContent, CardHeader, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  card: {
    minWidth: 275,
    minHeight: 280,
  },
  cardHeader: {
    textAlign: 'center',
  },
  cardContent: {
    backgroundColor: '#00000012',
  },
  cardData: {
    paddingTop: 30,
    fontSize: 64,
    height: 110,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardActions: {
    minHeight: 40,
  },
}));

const DashboardCard = (props: any) => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader className={classes.cardHeader} 
        title={props.title}
        titleTypographyProps={{color: 'textSecondary'}}/>
      <CardContent className={classes.cardContent}>
        <Typography className={classes.cardData} color="textPrimary" gutterBottom>
          {props.data}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small">{props.buttonText}</Button>
      </CardActions>
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.element,
  ]),
  buttonText: PropTypes.string,
  buttonDestination: PropTypes.string,
};

export default DashboardCard;
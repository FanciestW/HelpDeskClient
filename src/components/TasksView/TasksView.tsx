import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MUIDataTable from 'mui-datatables';
import { Fab, Tooltip, makeStyles } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useQuery, gql, ApolloError, ServerParseError } from '@apollo/client';
import { changeAuthed } from '../../redux/actions/AuthedActions';
import ITask from '../../interfaces/Task';
import IUser from '../../interfaces/User';
import { IRootReducer } from '../../redux/IRootReducer';

const useStyles = makeStyles((theme) => ({
  addFab: {
    margin: theme.spacing(1),
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'absolute',
  }  
}));

export default function TasksView() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [tasksData, setTasksData] = useState<string[][]>([]);
  const { uid }: IUser = useSelector<IRootReducer, IUser>(state => state.userReducer?.user) || {};

  const getTasksQuery = gql`
    query {
      getTasks {
        taskId
        title
        description
        createdBy {
          uid
          firstName
          lastName
        }
        assignedTo {
          uid
          firstName
          lastName
        }
        status
        priority
        dueDate
      }
    }
  `;

  const { refetch } = useQuery(getTasksQuery, {
    onCompleted: (data: { getTasks: ITask[] }) => {
      const formattedData = data?.getTasks?.map((task: ITask) => {
        let dueDate = 'No Date';
        try {
          dueDate = Intl.DateTimeFormat('en-US').format(new Date(task.dueDate || '')).toString();
        } catch (err) {
          dueDate = 'No Date';
        }
        return [
          task.title ? `${task.title?.substring(0, 40)}${task.title?.length > 40 ? '...' : ''}` : '',
          task.description ? `${task.description?.substring(0, 80)}${task.description?.length > 80 ? '...' : ''}` : '',
          task.createdBy ? `${task.createdBy?.firstName} ${task.createdBy?.lastName}` : '',
          task.assignedTo ? `${task.assignedTo?.firstName} ${task.assignedTo?.lastName}` : '',
          task.status || 'N/A',
          task.priority?.toString() || 'N/A',
          dueDate,
          task.taskId || '',
        ];
      });
      setTasksData(formattedData);
    },
    onError: (error: ApolloError) => {
      if ((error.networkError as ServerParseError)?.statusCode === 401) {
        localStorage.setItem('authed', 'false');
        dispatch(changeAuthed(false));
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [uid]);

  const onTaskRowClick = (_data: string[], cellMeta: { dataIndex: number; rowIndex: number }) => {
    history.push(`/task/${tasksData[cellMeta.dataIndex][7]}`);
  };

  const columns = [
    {
      name: 'title',
      label: 'Title',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: true,
      }
    },
    {
      name: 'createdBy',
      label: 'Created By',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'assignedTo',
      label: 'Assigned To',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'priority',
      label: 'Priority',
      options: {
        filter: true,
        sort: true,
      }
    },
    {
      name: 'dueDate',
      label: 'Due Date',
      options: {
        filter: false,
        sort: true,
      }
    }
  ];

  return (
    <div>
      <MUIDataTable
        title='All Tasks'
        data={tasksData}
        columns={columns}
        options={{
          filterType: 'multiselect',
          print: false,
          download: false,
          rowsPerPageOptions: [5, 10, 20, 50],
          onRowClick: onTaskRowClick,
        }}
      />
      <Tooltip title='New Task'>
        <Fab className={classes.addFab}
          aria-label='add'
          color='primary'
          onClick={() => history.push('/task/new')}>
          <AddIcon />
        </Fab>
      </Tooltip>
    </div>
  );
}

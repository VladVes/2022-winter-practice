import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerAutogen from 'swagger-autogen';

const _dirname = dirname(fileURLToPath(import.meta.url));
console.log(_dirname);

const doc = {
  info: {
    title: 'Kanban API',
    description:
      'Documentation automatically generated by the <b>swagger-autogen</b> module.',
  },
  definitions: {
    Tokens: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjIxZmM1MjM3OGNjMzQzM2E3MTkxYiIsImlhdCI6MTY0MzQzNTI0MiwiZXhwIjoxNjQzNDM3MDQyfQ.j1tQjw1tK4qQBZ7Rcfvly2J5Q0THoWc7BiTnHPFIrGc',
      refreshToken: 'ec59ea02-4610-43e5-ba81-a9fb084e82c5',
    },
    RefreshToken: {
      refreshToken: 'ec59ea02-4610-43e5-ba81-a9fb084e82c5',
    },
    SignUpCred: {
      email: 'john@example.com',
      name: 'john',
      password: '12345678',
    },
    UserLoginCred: {
      email: 'john@example.com',
      password: '12345678',
    },
    Success: { success: true },
    Projects: [{ $ref: '#/definitions/Project' }],
    Project: {
      _id: '61e65cd062cdb8288b0e6484',
      name: 'default project',
      description: 'default project description',
    },
    Projects: [{ $ref: '#/definitions/Project' }],
    NewProject: {
      name: 'default project',
      description: 'default project description',
    },
    Board: {
      _id: '61e65d624327f14b2f7bf00c',
      name: 'default board',
      projectId: '61e65cd062cdb8288b0e6484',
    },
    Boards: [{ $ref: '#/definitions/Board' }],
    NewBoard: {
      name: 'default board',
      projectId: '61e65cd062cdb8288b0e6484',
    },
    Task: {
      _id: '61e7de469343e960064dce9e',
      name: 'task 1',
      description: 'task 1 description',
      creator: '61e5364f347b2493b8a42782',
      assignedTo: '61e5364f347b2493b8a42782',
      boardId: '61e65d624327f14b2f7bf00c',
      statusId: '61e65dfa4327f14b2f7bf00e',
      createdAt: '1970-01-20T00:16:25.670Z',
      updatedAt: '1970-01-20T00:16:25.670Z',
      elapsedTime: 1641005765247,
      id: '61e7de469343e960064dce9e',
    },
    Tasks: [{ $ref: '#/definitions/Task' }],
    NewTask: {
      name: 'new task',
      description: 'new task description',
      assignedTo: '61e5364f347b2493b8a42782',
      boardId: '61e65d624327f14b2f7bf00c',
      statusId: '61e65dfa4327f14b2f7bf00e',
      elapsedTime: 0,
    },
    Status: {
      _id: '61e65e4f5914c628f9ae5656',
      name: 'In progress',
      boardIds: ['61e65d624327f14b2f7bf00c'],
    },
    Statuses: [{ $ref: '#/definitions/Status' }],
    NewStatus: {
      name: 'new status name',
      boardIds: ['61e65d624327f14b2f7bf00c'],
    },
    User: {
      _id: '61e5374b347b2493b8a42783',
      name: 'John Doe',
      email: 'akrays@aspirity.com',
      avatarLink: 'https://avatarSite/userAvatar.jpg',
      projectIds: ['61e65d624327f14b2f7bf00c'],
      boardIds: ['61e65d624327f14b2f7bf'],
    },
    Users: [{ $ref: '#/definitions/User' }],
    NewUser: {
      name: 'John Doe',
      password: '12345678',
      email: 'john@example.com',
      avatarLink: 'https://avatarSite/userAvatar.jpg',
      projectIds: ['61e65d624327f14b2f7bf00c'],
      boardIds: ['61e65d624327f14b2f7bf'],
    },
  },
};

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json');
// массив путей к роутерам
const endpointsFiles = [
  join(_dirname, '../routes/auth.js'),
  join(_dirname, '../routes/user/user.js'),
  join(_dirname, '../routes/project/project.js'),
  join(_dirname, '../routes/board/board.js'),
  join(_dirname, '../routes/status/status.js'),
  join(_dirname, '../routes/task/task.js'),
];

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(
  ({ success }) => {
    console.log(`Generated: ${success}`);
  },
);

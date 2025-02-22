import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, PrismaService],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('must return a list of tasks', async () => {
    jest.spyOn(prisma.task, 'findMany').mockResolvedValue([
      {
        id: '8ce5c241-126b-4a32-9bea-2e485a290d34',
        title: 'Tarefa 1',
        description: 'Descrição 1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '105ffaa5-b91b-4162-a52b-8eef0d0a302d',
        title: 'Tarefa 2',
        description: 'Descrição 2',
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(prisma.task, 'count').mockResolvedValue(2);

    const result = await service.getAllTasks({
      page: 1,
      limit: 2,
      completed: false,
    });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('must filter tasks by completion status', async () => {
    jest.spyOn(prisma.task, 'findMany').mockResolvedValue([
      {
        id: '1a3f567b-789c-4d6e-a3c2-b5e0b2e38d17',
        title: 'Tarefa Incompleta',
        description: 'Teste',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(prisma.task, 'count').mockResolvedValue(1);

    const result = await service.getAllTasks({
      completed: false,
      page: 1,
      limit: 2,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].completed).toBe(false);
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('must search tasks by title or description', async () => {
    jest.spyOn(prisma.task, 'findMany').mockResolvedValue([
      {
        id: '2f4a1c56-df79-4e1b-9af7-cf8b3ea6375d',
        title: 'Importante',
        description: 'Teste',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(prisma.task, 'count').mockResolvedValue(1);

    const result = await service.getAllTasks({
      search: 'Importante',
      page: 1,
      limit: 2,
      completed: false,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toContain('Importante');
    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('must correctly calculate pagination', async () => {
    jest.spyOn(prisma.task, 'findMany').mockResolvedValue([
      {
        id: '3d2e456c-11af-4a61-b6d5-89eb9b6f4a34',
        title: 'Task 1',
        description: 'task 1',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4a1f7b90-587b-43c8-9ff4-85e3c6b89d21',
        title: 'Task 2',
        description: 'task 2',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    jest.spyOn(prisma.task, 'count').mockResolvedValue(5); // Total de 5 tarefas no banco

    const result = await service.getAllTasks({
      page: 1,
      limit: 2,
      completed: false,
    });

    expect(result.data).toHaveLength(2);
    expect(result.total).toBe(5);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(3);
  });
});

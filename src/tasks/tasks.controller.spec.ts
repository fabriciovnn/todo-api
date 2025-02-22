import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            getAllTasks: jest.fn().mockResolvedValue({
              data: [
                {
                  id: '105ffaa5-b91b-4162-a52b-8eef0d0a302d',
                  title: 'Test Task',
                  description: 'Testing',
                  completed: false,
                },
              ],
              total: 1,
              page: 1,
              totalPages: 1,
            }),
          },
        },
      ],
    }).compile();
    controller = module.get<TasksController>(TasksController);
  });
  it('should be defined', async () => {
    const result = await controller.getAllTasks();
    expect(result.data).toHaveLength(1);
    expect(result.total).toBe(1);
  });
});

import { jest } from '@jest/globals'
import { Runner } from './Runner.js'
import { SilentError, OutputError } from './errors/index.js'

describe('scripts', () => {
  describe('Runner', () => {
    it('should create correct instance', () => {
      const scripts = []
      const runner = new Runner(scripts)

      expect(runner.scripts).toBe(scripts)
      expect(runner.isOutputEnabled).toBe(false)
    })

    describe('#run', () => {
      it('should run serial tasks', async () => {
        const subtaskA = jest.fn()
        const subtaskB = jest.fn()
        const runner = new Runner({
          task: {
            title: 'Task',
            run: ['subtaskA', 'subtaskB']
          },
          subtaskA: {
            title: 'Subtask A',
            run: subtaskA
          },
          subtaskB: {
            title: 'Subtask B',
            run: subtaskB
          }
        })
        const runScript = jest.spyOn(runner, 'runScript')
        const runSerialTasks = jest.spyOn(runner, 'runSerialTasks')
        const runParallelTasks = jest.spyOn(runner, 'runParallelTasks')
        const runTask = jest.spyOn(runner, 'runTask')
        const argv = ['foo', 'bar']
        const tasksCalls = [
          [
            {
              stdio: true,
              argv
            }
          ]
        ]

        await runner.run('task', argv)

        expect(runScript).toHaveBeenCalledTimes(3)
        expect(runSerialTasks).toHaveBeenCalledTimes(3)
        expect(runParallelTasks).toHaveBeenCalledTimes(0)
        expect(runTask).toHaveBeenCalledTimes(4)

        expect(subtaskA.mock.calls).toEqual(tasksCalls)
        expect(subtaskB.mock.calls).toEqual(tasksCalls)
      })

      it('should run parallel tasks', async () => {
        const subtaskA = jest.fn()
        const subtaskB = jest.fn()
        const runner = new Runner({
          task: {
            title: 'Task',
            run: ['subtaskA', 'subtaskB'],
            parallel: true
          },
          subtaskA: {
            title: 'Subtask A',
            run: subtaskA
          },
          subtaskB: {
            title: 'Subtask B',
            run: subtaskB
          }
        })
        const runScript = jest.spyOn(runner, 'runScript')
        const runSerialTasks = jest.spyOn(runner, 'runSerialTasks')
        const runParallelTasks = jest.spyOn(runner, 'runParallelTasks')
        const runTask = jest.spyOn(runner, 'runTask')
        const argv = ['foo', 'bar']
        const tasksCalls = [
          [
            {
              stdio: false,
              argv
            }
          ]
        ]

        await runner.run('task', argv)

        expect(runScript).toHaveBeenCalledTimes(3)
        expect(runSerialTasks).toHaveBeenCalledTimes(2)
        expect(runParallelTasks).toHaveBeenCalledTimes(1)
        expect(runTask).toHaveBeenCalledTimes(4)

        expect(subtaskA.mock.calls).toEqual(tasksCalls)
        expect(subtaskB.mock.calls).toEqual(tasksCalls)
      })

      it('should handle error', async () => {
        const taskError = new Error('Test error message')
        const runner = new Runner({
          task: {
            title: 'Task',
            run: () => {
              throw taskError
            }
          }
        })
        const log = jest.spyOn(console, 'log').mockImplementation(() => 0)
        const error = jest.spyOn(console, 'error').mockImplementation(() => 0)

        runner.isOutputEnabled = true

        await expect(runner.run('task')).rejects.toThrow(SilentError)

        expect(log).toHaveBeenCalledTimes(2)
        expect(error).toHaveBeenCalledTimes(1)
        expect(error.mock.calls[0][0]).toBe(taskError)

        log.mockRestore()
        error.mockRestore()
      })

      it('should handle output error', async () => {
        const runner = new Runner({
          task: {
            title: 'Task',
            run: () => {
              throw new OutputError()
            }
          }
        })
        const log = jest.spyOn(console, 'log').mockImplementation(() => 0)
        const error = jest.spyOn(console, 'error').mockImplementation(() => 0)

        runner.isOutputEnabled = true

        await expect(runner.run('task')).rejects.toThrow(SilentError)

        expect(log).toHaveBeenCalledTimes(2)
        expect(error).toHaveBeenCalledTimes(0)

        log.mockRestore()
        error.mockRestore()
      })
    })
  })
})

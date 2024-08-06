import { task } from "../dist/index.mjs"

const testTask = async () => {
  const task1 = await task.startTask({
    name: "Task 1",
  })
  await new Promise((resolve) => setTimeout(resolve, 500))
  for (let i = 0; i < 50; i++) {
    task1.log("This is a task message " + i)
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  task1.stop("Task 1 is done")

  const task2 = await task.startTask({
    name: "Task 2",
  })
  await new Promise((resolve) => setTimeout(resolve, 500))
  for (let i = 0; i < 10; i++) {
    if (i === 5) {
      task2.error("This is an error message")
    } else if (i === 3 || i === 7) {
      task2.warn("This is a warning message")
    } else {
      task2.info("This is a task message " + i)
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  task2.stop("Task 2 is done")
}
testTask()

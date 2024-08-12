# Task 📝

Task is an intuitive and robust tool for logging messages and tracking task progress of your scripts. It's designed to be simple to integrate and provides a variety of logging options to suit your needs.

_Based on the original [Logger](https://github.com/rharkor/logger) project._

[Task demo](https://github.com/user-attachments/assets/ee69aeaf-3ea5-4faf-b90b-8737be156740)

## Features 🌟

- **Simple Integration**: Easily add Task to your project with a single command.
- **Customizable Logging**: Choose from a variety of logging options to suit your needs.
- **Task Tracking**: Monitor task progress with Task's built-in tracking capabilities.

## Installation 🔧

Install Task with a simple command:

```bash
npm install @rharkor/task
```

## Usage 🛠️

### Task

To start using task in your project, simply import and use the logging functions as shown:

```typescript
import { task } from "@rharkor/task"

const task1 = await task.startTask({
  name: "Task 1",
})
for (let i = 0; i < 50; i++) {
  task1.log("This is a task message " + i)
  await new Promise((resolve) => setTimeout(resolve, 50))
}
task1.stop("Task 1 is done")
```

## License 📄

This project is distributed under the MIT License. For more details, see the [LICENSE](LICENSE) file in the repository.

This enhanced README not only clarifies usage but also incorporates emojis to make it more engaging and reader-friendly.

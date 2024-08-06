import { logger } from "@rharkor/logger"
const { addPrefixToArgs, errorText, infoText, log, successText, warnText } = logger.utils
import { stderr } from "process"
import { clearLine, moveCursor } from "readline"

/**
 * Clear the last lines of the terminal
 * @param count
 */
const clearLastLines = (count: number) => {
  for (let i = 0; i < count; i++) {
    moveCursor(stderr, 0, -1) // Move cursor up one line
    clearLine(stderr, 0) // Clear the current line
  }
}

export type TLineKind = "log" | "error" | "info" | "warn" | "success"

/**
 * Maintain a max number of lines in the terminal like a window
 */
export const windowLog = (
  maxLines: number,
  opts?: { noPrint?: boolean; topPrefix?: () => string; topInterval?: number },
) => {
  const lines: { content: string; kind: TLineKind }[] = []
  let numberOfLines = 0
  let hasPrintedTopPrefix = false
  let prefixValue = ""
  const handleLine = (line: string | null, kind: TLineKind) => {
    const rows = process.stdout.rows
    maxLines = Math.min(maxLines, rows - 1 - (opts?.topPrefix ? 1 : 0))

    const toClear = Math.min(numberOfLines, maxLines)
    clearLastLines(toClear)

    const columns = process.stdout.columns

    if (line) {
      lines.push({ content: line, kind })
      // Add the number of lines based on the line length and the columns
      const lineLength = Math.ceil(line.length / columns)
      numberOfLines += lineLength
    }
    if (numberOfLines > maxLines) {
      const removedLine = lines.shift()
      if (removedLine) {
        const removedLineLength = Math.ceil(removedLine.content.length / columns)
        numberOfLines -= removedLineLength
      }
    }
    const printable = lines.map((l) => {
      const wrapper =
        l.kind === "error"
          ? errorText
          : l.kind === "info"
            ? infoText
            : l.kind === "success"
              ? successText
              : l.kind === "warn"
                ? warnText
                : log
      const value = addPrefixToArgs(logger.prefix, wrapper(l.content)) as string[]
      return value.join(" ")
    })
    if (!opts?.noPrint) {
      // Print the top prefix
      if (opts?.topPrefix) {
        if (hasPrintedTopPrefix) {
          clearLastLines(1)
        }
        if (line === null) {
          prefixValue = opts.topPrefix()
        }
        stderr.write(prefixValue + "\n")
        hasPrintedTopPrefix = true
      }
      // Print the lines
      printable.forEach((l) => {
        stderr.write(l)
      })
    }
    return printable
  }

  const print = (line: string, type: TLineKind = "log") => {
    handleLine(line, type)
  }

  let interval: NodeJS.Timeout | null = null
  if (opts) {
    handleLine(null, "log")
    const { topInterval, topPrefix } = opts
    if (topInterval && topPrefix)
      interval = setInterval(() => {
        handleLine(null, "log")
      }, topInterval)
  }

  const stop = ({
    noClear,
    successMessage,
    endPrint,
  }: {
    successMessage?: string
    noClear?: boolean
    endPrint?: {
      content: string
      kind: TLineKind
    }[]
  } = {}) => {
    if (interval) {
      clearInterval(interval)
    }
    if (!noClear) {
      const toClear = Math.min(numberOfLines, maxLines) + 1
      clearLastLines(toClear)
    }
    if (endPrint && endPrint?.length > 0) {
      endPrint.forEach((l) => {
        logger[l.kind](l.content)
      })
    }
    if (successMessage) {
      logger.success(successMessage)
    }
  }

  return { print, stop }
}

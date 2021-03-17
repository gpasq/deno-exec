# Exec
Deno functions as a great replacement for Python, Bash, and other scripting platforms. In that capacity
it should have an easy way to execute external scripts.

This mod builds on the existing Deno.run functionality to allow you to simplify your work.  It will 
allow you to pass standard command lines and either display or capture the output (or both).  

For example:

## Run a simple external command and display the output
To run an external command and display the output:
```
import { exec } from "https://deno.land/x/exec/mod.ts";
await exec('echo Hello World');
```
Big deal.  But lets say you're running a docker swarm and want to scale a process to 3 nodes:
```
import { exec } from "https://deno.land/x/exec/mod.ts";

await exec('ssh foo@xxx.xxx.com "docker service scale some_service=3"');
await exec('ssh foo@xxx.xxx.com "docker service ls"');

```

## Run commands in "follow" mode
Some commands like `tail -f` or `docker logs -f` have the ability to run in "follow" mode.  In this mode,
they continue to run while data is appended to stdout over time.  You can do this with:
```
import { exec } from "https://deno.land/x/exec/mod.ts";
await exec('docker service logs someapi -f');
```
In this case, the connection to stdout will remain open until you terminate the function.

## Capture the output of an external command
Sometimes you need to capture the output of a command.  For example, I do this to get git log checksums:
```
import { exec, OutputMode } from "https://deno.land/x/exec/mod.ts";
let response = await exec('git log -1 --format=%H', {output: OutputMode.Capture});
```

With the response object in hand, you can grab the status code and any data that would have been
written to stdout.  The response is of type IExecResponse and is shaped as follows:
```
export interface IExecStatus {
  code: number;
  success: boolean;
}

export interface IExecResponse {
  status: IExecStatus;
  output: string;
}
```
## Does piping work?

When you think of piping in a case list this, you often think of something like

```
cat test.ts | sed -e 's/^/prefix/'
```

In that case, piping is actually done by the shell, so `exec` cannot do that itself. However, it can do this, which accomplishes the same thing:

```
let r = await exec(
  `bash -c "cat test.ts | sed -e 's/^/prefix/'"`,
);
```

Similarly, you can do redirection.

If you want to implement your own piping within the app, you can (currently) capture the output of one exec call and pass it to the next.

## Command Sequences
In addition to running commands, you can run a sequence of commands in one call.  For example:

```
let response = await execSequence([
      "echo Hello World",
      "ls -l",
      "cat helloworld.txt",
    ], { output: OutputMode.None, continueOnError: false });
```

In this case, the commands are simply run one after the other, in sequence.  The OutputMode is applied to 
all commands in the sequence, and the results of each command are returned.  

If an error occurs (command result != 0), the `continueOnError` flag determines if execution continues or
returns immediately after the error.  The `continueOnError` default value is `false`.

## Releases

Current version is 0.0.5.  This version cleans up some typescript stuff, and adds a `verbose` flag to the options

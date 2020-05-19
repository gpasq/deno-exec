import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

import { exec, execSequence, IExecResponse, OutputMode } from "./mod.ts";

Deno.test({
  name: "Testing Simple Commands",
  async fn(): Promise<void> {
    let response = await exec(
      "echo Hello World",
      { output: OutputMode.None, verbose: true },
    );
    assertEquals(response.output, "");
    assertEquals(response.status.code, 0);

    response = await exec("echo Hello World");
    assertEquals(response.output, "");
    assertEquals(response.status.code, 0);

    response = await exec(
      "echo Hello World",
      { output: OutputMode.Capture, verbose: true },
    );
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec(
      "cat helloworld.txt",
      { output: OutputMode.Capture, verbose: true },
    );
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec(
      "echo Hello World",
      { output: OutputMode.Tee, verbose: true },
    );
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec(
      "cat helloworld.txt",
      { output: OutputMode.Tee, verbose: true },
    );
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec(
      "cat anonexistentfile.txt",
      { output: OutputMode.Capture, verbose: true },
    );
    assertEquals(response.output, "");
    assertEquals(response.status.code, 1);
  },
});

Deno.test({
  name: "Testing Command Sequences",
  async fn(): Promise<void> {
    let response = await execSequence([
      "echo Hello World",
      "ls -l",
      "cat helloworld.txt",
    ], { output: OutputMode.None, continueOnError: false, verbose: true });

    assertEquals(response.length, 3);
    response.forEach((r: IExecResponse) => {
      assertEquals(r.status.code, 0);
    });
  },
});

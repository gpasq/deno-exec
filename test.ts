import {
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";

import { exec, IExecResponse, OutputMode } from "./mod.ts";

Deno.test({
  name: "Testing Simple Commands",
  async fn(): Promise<void> {
    let response = await exec("echo Hello World", { output: OutputMode.None });
    assertEquals(response.output, "");
    assertEquals(response.status.code, 0);

    response = await exec("echo Hello World");
    assertEquals(response.output, "");
    assertEquals(response.status.code, 0);

    response = await exec("echo Hello World", { output: OutputMode.Capture });
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec("cat helloworld.txt", { output: OutputMode.Capture });
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec("echo Hello World", { output: OutputMode.Tee });
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec("cat helloworld.txt", { output: OutputMode.Tee });
    assertEquals(response.output, "Hello World");
    assertEquals(response.status.code, 0);

    response = await exec(
      "cat anonexistentfile.txt",
      { output: OutputMode.Capture },
    );
    assertEquals(response.output, "");
    assertEquals(response.status.code, 1);
  },
});

let taskId = 1;

function workLoop(IdleDeadline) {
  taskId++;

  let shouldYield = false;
  while (!shouldYield) {
    // run task
    console.log(
      `taskId: ${taskId} have timeRemaining ${IdleDeadline.timeRemaining()}`
    );

    shouldYield = IdleDeadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

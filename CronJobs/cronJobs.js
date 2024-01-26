const cron = require("node-cron");
const { differenceInDays, startOfDay, addDays } = require("date-fns");
const Task = require("../modals/taskModal");
const accountSid = "ACe42cc8db38d93d60bee3e14a3996084f";
const authToken = "be12c10a311b5ea4754469e958dea03c";
const twilioClient = require("twilio")(accountSid, authToken);

cron.schedule("*/10 * * * * *", async () => {
  try {
    const today = startOfDay(new Date());

    const newDate = addDays(today, 4);

    const tasksToUpdate = await Task.find({
      due_date: { $lt: newDate },
      status: { $ne: "DONE" },
    });

    tasksToUpdate.forEach(async (task) => {
      const taskDueDate = startOfDay(new Date(task.due_date));

      const daysRemaining = differenceInDays(taskDueDate, today);

      if (daysRemaining === 0) {
        task.priority = 0;
      } else if (daysRemaining <= 2) {
        task.priority = 1;
      } else if (daysRemaining <= 4) {
        task.priority = 2;
      } else {
        task.priority = 3;
      }

      await task.save();
    });

    console.log("Task priorities updated successfully.");
  } catch (error) {
    console.error("Error updating task priorities:", error);
  }
});

let callsInProgress = false;
cron.schedule("*/30 * * * * *", async () => {
  try {
    if (callsInProgress) {
      console.log("Calls are already in progress. Skipping...");
      return;
    }
    callsInProgress = true;
    const overdueTasks = await Task.find({
      due_date: { $lt: new Date() },
      status: { $ne: "DONE" },
    }).populate("user_id");

    const sortedTasks = overdueTasks.sort(
      (a, b) => a.user_id.priority - b.user_id.priority
    );
    for (const task of sortedTasks) {
      const phoneNumber = task.user_id.phone_number;
      const twilioCall = await twilioClient.calls.create({
        to: `+91${phoneNumber}`,
        from: "12178170660",
        url: "https://e9b5-116-206-157-240.ngrok-free.app/voice",
      });
      console.log("Call made to:", phoneNumber);
      const callSid = twilioCall.sid;
      let callDone = false;
      while (callDone === false) {
        const callStatus = await twilioClient.calls(callSid).fetch();
        console.log(callStatus.status);
        if (
          callStatus.status === "canceled" ||
          callStatus.status === "completed" ||
          callStatus.status === "failed" ||
          callStatus.status === "busy" ||
          callStatus.status === "no-answer"
        ) {
          callDone = true;
        }
      }
    }
    callsInProgress = false;
    console.log("Voice calls made successfully.");
  } catch (error) {
    console.error("Error making voice calls:", error);
    callsInProgress = false;
  }
});

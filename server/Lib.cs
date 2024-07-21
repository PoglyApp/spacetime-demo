using SpacetimeDB.Module;
using static SpacetimeDB.Runtime;

static partial class Module
{
    #region Tables
    [SpacetimeDB.Table(Public = true)]
    public partial struct Tasks
    {
        [SpacetimeDB.Column(ColumnAttrs.PrimaryKeyAuto)]
        public uint Id;

        public uint GuestId;
        public string Name;
        public bool Completed;
    }

    [SpacetimeDB.Table(Public = true)]
    public partial struct Guest
    {
        [SpacetimeDB.Column(ColumnAttrs.PrimaryKeyAuto)]
        public uint Id;

        [SpacetimeDB.Column(ColumnAttrs.Unique)]
        public Identity Identity;
    }
    #endregion
    
    #region Special Reducer
    [SpacetimeDB.Reducer(ReducerKind.Connect)]
    public static void OnConnect(ReducerContext ctx)
    {
        try
        {
            var guest = Guest.FindByIdentity(ctx.Sender);
            if (guest is null)
            {
                new Guest
                {
                    Identity = ctx.Sender
                }.Insert();
                Log("Creating a new guest entry for unique joiner!");
            }
        }
        catch (Exception e)
        {
            Log("Woops we had an issue! " + e.Message);
        }
    }
    #endregion

    #region Reducers
    [SpacetimeDB.Reducer]
    public static void AddTask(ReducerContext ctx, string task)
    {
        try
        {
            var guest = Guest.FindByIdentity(ctx.Sender);

            if (guest is null)
            {
                Log("Guest is null but tried to add a task!");
                return;
            }
            
            new Tasks
            {
                GuestId = guest.Value.Id,
                Name = task,
                Completed = false
            }.Insert();
        }
        catch (Exception e)
        {
            Log("issue adding task! " + e.Message);
        }
    }

    [SpacetimeDB.Reducer]
    public static void CompleteTask(ReducerContext ctx, uint taskId)
    {
        try
        {
            var task = Tasks.FindById(taskId);
            if (task is null)
            {
                Log("Guest tried to complete a task that doesn't exist!" + ctx.Sender);
                return;
            }

            var guest = Guest.FindByIdentity(ctx.Sender);
            if (guest is null)
            {
                Log("Guest doesn't exist and tried to complete a task!" + ctx.Sender);
                return;
            }

            if (guest.Value.Id != task.Value.GuestId)
            {
                Log("Guest tried to complete someone elses task!");
                return;
            }

            var updatedTask = task.Value;
            updatedTask.Completed = true;
            Tasks.UpdateById(taskId, updatedTask);
        }
        catch (Exception e)
        {
            Log("issue completing task! " + e.Message);
        }
    }

    [SpacetimeDB.Reducer]
    public static void ClearAllTasks(ReducerContext ctx)
    {
        try
        {
            var guest = Guest.FindByIdentity(ctx.Sender);
            if (guest is null)
            {
                Log("guest that doesn't exist tried to clear all their tasks!");
                return;
            }

            foreach (var t in Tasks.Iter())
            {
                if (t.GuestId == guest.Value.Id)
                {
                    Tasks.DeleteById(t.Id);
                }
            }
        }
        catch (Exception e)
        {
            Log("issue clearing all tasks! " + e.Message);
        }
    }
    #endregion
}

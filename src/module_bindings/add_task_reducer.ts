// THIS FILE IS AUTOMATICALLY GENERATED BY SPACETIMEDB. EDITS TO THIS FILE
// WILL NOT BE SAVED. MODIFY TABLES IN RUST INSTEAD.

// @ts-ignore
import { __SPACETIMEDB__, AlgebraicType, ProductType, BuiltinType, ProductTypeElement, DatabaseTable, AlgebraicValue, ReducerArgsAdapter, SumTypeVariant, Serializer, Identity, Address, ReducerEvent, Reducer, SpacetimeDBClient } from "@clockworklabs/spacetimedb-sdk";

export class AddTaskReducer extends Reducer
{
	public static reducerName: string = "AddTask";
	public static call(_task: string) {
		this.getReducer().call(_task);
	}

	public call(_task: string) {
		const serializer = this.client.getSerializer();
		let _taskType = AlgebraicType.createPrimitiveType(BuiltinType.Type.String);
		serializer.write(_taskType, _task);
		this.client.call("AddTask", serializer);
	}

	public static deserializeArgs(adapter: ReducerArgsAdapter): any[] {
		let taskType = AlgebraicType.createPrimitiveType(BuiltinType.Type.String);
		let taskValue = AlgebraicValue.deserialize(taskType, adapter.next())
		let task = taskValue.asString();
		return [task];
	}

	public static on(callback: (reducerEvent: ReducerEvent, _task: string) => void) {
		this.getReducer().on(callback);
	}
	public on(callback: (reducerEvent: ReducerEvent, _task: string) => void)
	{
		this.client.on("reducer:AddTask", callback);
	}
}


export default AddTaskReducer
